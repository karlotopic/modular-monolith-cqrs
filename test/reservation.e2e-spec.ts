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

describe('Reservation (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;

  let tokenRepository: TokenRepository;
  let userRepository: UserManagementRepository;

  let cryptoProvider: CryptoProvider;
  let jwtProvider: JWtProvider;

  const testUser = {
    email: 'testreservationuser@email.com',
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

    seedFutureReservations(prismaService);

    await setupApp();
  });

  describe('Get Vip reservations flows', () => {
    let accessToken: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testUser.email, password: testUser.password });
      accessToken = res.body.accessToken;
    });

    it('should return correct VIP reservation counts for valid date range', async () => {
      const dateFrom = addDays(1).toISOString().slice(0, 10); // 1 day in future
      const dateTo = addDays(6).toISOString().slice(0, 10); // 6 days in future

      const res = await request(app.getHttpServer())
        .get('/reservations/confirmed-vip')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({
          dateFrom,
          dateTo,
        });
      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(res.body.data).toBeDefined();
      // Only CONFIRMED and vip: true in this range: prop-001, prop-002
      expect(res.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            propertyId: 'prop-001',
            vipReservationCount: 1,
          }),
          expect.objectContaining({
            propertyId: 'prop-002',
            vipReservationCount: 1,
          }),
        ]),
      );
      // Should not include non-vip or non-confirmed
      expect(res.body.data).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({ propertyId: 'prop-003' }),
          expect.objectContaining({ propertyId: 'prop-004' }),
          expect.objectContaining({ propertyId: 'prop-005' }),
        ]),
      );
    });

    it('should return empty data if no VIP reservations in range', async () => {
      const dateFrom = addDays(-30).toISOString().slice(0, 10);
      const dateTo = addDays(-25).toISOString().slice(0, 10);

      const res = await request(app.getHttpServer())
        .get('/reservations/confirmed-vip')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({
          dateFrom,
          dateTo,
        });
      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(res.body.data).toEqual([]);
    });

    it('should return 400 for invalid date input', async () => {
      const dateTo = addDays(6).toISOString().slice(0, 10);
      const res = await request(app.getHttpServer())
        .get('/reservations/confirmed-vip')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({
          dateFrom: 'not-a-date',
          dateTo,
        });
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 401 if not authenticated', async () => {
      const dateFrom = addDays(1).toISOString().slice(0, 10);
      const dateTo = addDays(6).toISOString().slice(0, 10);
      const res = await request(app.getHttpServer())
        .get('/reservations/confirmed-vip')
        .query({
          dateFrom,
          dateTo,
        });
      expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
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

  function addDays(days: number) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
  }

  async function seedFutureReservations(prisma: PrismaService) {
    await prisma.reservation.deleteMany({});
    await prisma.reservation.createMany({
      data: [
        // VIP, CONFIRMED, in range
        {
          id: 'test-vip-1',
          propertyId: 'prop-001',
          arrival: addDays(2),
          departure: addDays(4),
          status: 'CONFIRMED',
          vip: true,
          createdAt: addDays(-1),
          updatedAt: addDays(1),
        },
        // VIP, CONFIRMED, in range
        {
          id: 'test-vip-2',
          propertyId: 'prop-002',
          arrival: addDays(3),
          departure: addDays(5),
          status: 'CONFIRMED',
          vip: true,
          createdAt: addDays(-2),
          updatedAt: addDays(2),
        },
        // Not VIP
        {
          id: 'test-nonvip',
          propertyId: 'prop-003',
          arrival: addDays(2),
          departure: addDays(4),
          status: 'CONFIRMED',
          vip: false,
          createdAt: addDays(-1),
          updatedAt: addDays(1),
        },
        // Not CONFIRMED
        {
          id: 'test-pending',
          propertyId: 'prop-004',
          arrival: addDays(2),
          departure: addDays(4),
          status: 'PENDING',
          vip: true,
          createdAt: addDays(-1),
          updatedAt: addDays(1),
        },
        // VIP, CONFIRMED, out of range
        {
          id: 'test-vip-out',
          propertyId: 'prop-005',
          arrival: addDays(20),
          departure: addDays(22),
          status: 'CONFIRMED',
          vip: true,
          createdAt: addDays(-1),
          updatedAt: addDays(1),
        },
      ],
    });
  }

  afterAll(async () => {
    await module.close();
  });
});
