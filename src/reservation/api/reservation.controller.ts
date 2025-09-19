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
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetVipReservationsResult } from '../application/dto/get-vip-reservations-result.dto';

@ApiTags('reservations')
@Controller('reservations')
@UseGuards(AuthGuard)
export class ReservationController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/confirmed-vip')
  @ApiOkResponse({
    type: GetVipReservationsResult,
    description: 'List of confirmed VIP reservations',
  })
  async getConfirmedVipRes(
    @Query()
    getVipReservations: GetVipReservationsDto,
  ): Promise<GetVipReservationsResult> {
    return this.queryBus.execute(
      new GetConfirmedVipReservationQuery(
        getVipReservations.dateFrom,
        getVipReservations.dateTo,
      ),
    );
  }
}
