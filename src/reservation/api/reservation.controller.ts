import {
  Controller,
  Get,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '../../shared/auth/auth.guard';
import { GetVipReservationsDto } from '../application/dto/get-vip-reservations.dto';
import { GetConfirmedVipReservationQuery } from '../application/queries/get-confirmed-vip-reservation.query';

@Controller('reservations')
@UseGuards(AuthGuard)
export class ReservationController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/confirmed-vip')
  async getConfirmedVipRes(
    @Query()
    getVipReservations: GetVipReservationsDto,
  ) {
    return this.queryBus.execute(
      new GetConfirmedVipReservationQuery(
        getVipReservations.dateFrom,
        getVipReservations.dateTo,
      ),
    );
  }
}
