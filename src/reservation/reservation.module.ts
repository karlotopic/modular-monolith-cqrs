import { Module } from '@nestjs/common';
import { ReservationController } from './api/reservation.controller';
import { ReservationService } from './reservation.service';
import { ReservationRepository } from './infra/repositories/reservation.repository';
import { GetConfirmedVipReservationQueryHandler } from './application/queries/get-confirmed-vip-reservation.query';

const queries = [GetConfirmedVipReservationQueryHandler];

@Module({
  controllers: [ReservationController],
  providers: [
    ReservationService,
    {
      provide: 'IReservationRepository',
      useClass: ReservationRepository,
    },
    ...queries,
  ],
})
export class ReservationModule {}
