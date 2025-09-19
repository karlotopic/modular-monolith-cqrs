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

describe('User management (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;

  let tokenRepository: TokenRepository;
  let userRepository: UserManagementRepository;

  let cryptoProvider: CryptoProvider;
  let jwtProvider: JWtProvider;

  const testUser = {
    email: 'testusermanagement@email.com',
    password: 'StrongPassw0rd!',
  };

  beforeAll(async () => {
    const prismaService = new PrismaService();

    userRepository = new UserManagementRepository(prismaService);
    tokenRepository = new TokenRepository(prismaService);

    cryptoProvider = new CryptoProvider();
    jwtProvider = new JWtProvider();

    await setupApp();
  });

  afterAll(async () => {
    await module.close();
  });

  describe('Register flow', () => {
    describe('when user already exists', () => {
      beforeAll(async () => {
        await userRepository.create(
          new User(randomUUID(), 'already-existing@email.com', 'Password123'),
        );
      });

      it('should throw Conflict Exception', async () => {
        const res = await request(app.getHttpServer())
          .post('/users/register')
          .send({
            email: 'already-existing@email.com',
            password: 'Password123!#$%',
          });

        expect(res.statusCode).toBe(HttpStatus.CONFLICT);
      });
    });

    describe('when user does not exist', () => {
      it('should create the user and return access/refresh token pair', async () => {
        const res = await request(app.getHttpServer())
          .post('/users/register')
          .send({
            email: testUser.email,
            password: testUser.password,
          });

        expect(res.body.accessToken).toBeDefined();
        expect(res.body.refreshToken).toBeDefined();

        const userDb = await userRepository.findByEmail(testUser.email);
        expect(userDb).toBeDefined();
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
