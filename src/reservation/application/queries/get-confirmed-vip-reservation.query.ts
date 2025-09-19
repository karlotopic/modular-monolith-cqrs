import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import z from 'zod';
import { IReservationRepository } from '../../domain/interfaces/reservation.repository';
import { GetVipReservationsResult } from '../dto/get-vip-reservations-result.dto';

export class GetConfirmedVipReservationQuery implements IQuery {
  constructor(
    public readonly dateFrom?: Date,
    public readonly dateTo?: Date,
  ) {}
}

const getVipReservationSchema = z.object({
  dateFrom: z.date(),
  dateTo: z.date(),
});

@QueryHandler(GetConfirmedVipReservationQuery)
export class GetConfirmedVipReservationQueryHandler
  implements
    IQueryHandler<GetConfirmedVipReservationQuery, GetVipReservationsResult>
{
  constructor(
    @Inject('IReservationRepository')
    private reservationRepository: IReservationRepository,
  ) {}

  async execute(
    query: GetConfirmedVipReservationQuery,
  ): Promise<GetVipReservationsResult> {
    const { dateFrom, dateTo } = getVipReservationSchema.parse({
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
    });

    const reservations =
      await this.reservationRepository.countConfirmedVipReservations(
        dateFrom,
        dateTo,
      );

    return {
      data: reservations,
    };
  }
}
