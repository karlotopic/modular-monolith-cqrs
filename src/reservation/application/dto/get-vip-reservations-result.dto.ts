import { IQueryResult } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';

class VipReservationResult {
  @ApiProperty()
  propertyId: string;

  @ApiProperty()
  vipReservationCount: number;
}

export class GetVipReservationsResult implements IQueryResult {
  @ApiProperty()
  data: VipReservationResult[];
}
