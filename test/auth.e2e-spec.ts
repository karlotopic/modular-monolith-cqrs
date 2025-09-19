import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/shared/database/prisma.service';
import { UserManagementRepository } from '../src/user-management/infra/repositories/user-management.repository';
import { User } from '../src/user-management/domain/entities/user.entity';
import { randomUUID } from 'crypto';
import { CryptoProvider } from '../src/shared/crypto.provider';
import { TokenRepository } from '../src/auth/token.repository';
import { JWtProvider } from '../src/shared/jwt.provider';

describe('Auth flows', () => {
  let app: INestApplication;
  let module: TestingModule;

  let tokenRepository: TokenRepository;
  let userRepository: UserManagementRepository;

  let cryptoProvider: CryptoProvider;
  let jwtProvider: JWtProvider;

  const testUser = {
    email: 'testauthuser@email.com',
    password: 'StrongPassw0rd!',
  };
  let userId: string;

  let refreshToken: string;

  beforeAll(async () => {
    const prismaService = new PrismaService();

    userRepository = new UserManagementRepository(prismaService);
    tokenRepository = new TokenRepository(prismaService);

    cryptoProvider = new CryptoProvider();
    jwtProvider = new JWtProvider();

    userId = randomUUID();
    const hashedPassword = await cryptoProvider.generateHash(testUser.password);
    await userRepository.create(
      new User(userId, testUser.email, hashedPassword),
    );

    await setupApp();
  });

  afterAll(async () => {
    await module.close();
  });

  describe('Login flow', () => {
    describe('when user does not exist', () => {
      it('should fail and throw', async () => {
        const res = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: 'nouser@email.com', password: 'SomePassw0rd!' });
        expect(res.statusCode).toBe(HttpStatus.NOT_FOUND);
        expect(res.body.message).toMatch(/not found/i);
      });
    });

    describe('when user does exist', () => {
      describe('when wrong password provided', () => {
        it('should throw Unauthorized', async () => {
          const res = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: testUser.email, password: 'wrongPW123!' });
          expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
        });
      });

      describe('when correct data is provided', () => {
        it('should return access/refresh token', async () => {
          const res = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: testUser.email, password: testUser.password });

          expect(res.body.accessToken).toBeDefined();
          expect(res.body.refreshToken).toBeDefined();
          expect(res.statusCode).toBe(HttpStatus.OK);

          const refreshTokenDb = await tokenRepository.getRefreshToken(
            userId,
            res.body.refreshToken,
          );
          expect(refreshTokenDb).toBeDefined();

          refreshToken = res.body.refreshToken;
        });
      });
    });
  });

  describe('Refresh flow', () => {
    describe('when user provided invalid refresh token', () => {
      let badRefreshToken: string;
      beforeAll(() => {
        const { refreshToken } = jwtProvider.generateTokens({
          email: 'nonexisting@email.com',
          sub: 'userId',
        });
        badRefreshToken = refreshToken;
      });

      it('should fail and throw unauthorized', async () => {
        const res = await request(app.getHttpServer())
          .post('/auth/refresh')
          .send({
            userId: userId,
            refreshToken: badRefreshToken,
          });
        expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      });
    });

    describe('when user provided correct refresh token', () => {
      it('should generate a new one and store it in db', async () => {
        const res = await request(app.getHttpServer())
          .post('/auth/refresh')
          .send({
            userId,
            refreshToken,
          });

        expect(res.statusCode).toBe(HttpStatus.CREATED);
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.refreshToken).toBeDefined();
        const refreshTokenDb = await tokenRepository.getRefreshToken(
          userId,
          res.body.refreshToken,
        );
        expect(refreshTokenDb).toBeDefined();
      });
    });
  });

  const setupApp = async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  };

  afterAll(async () => {
    await module.close();
  });
});
