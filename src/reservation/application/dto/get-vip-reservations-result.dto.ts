import { IQueryResult } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';

export class VipReservationResult {
  @ApiProperty({ example: 'property-uuid' })
  propertyId: string;

  @ApiProperty({ example: 3 })
  vipReservationCount: number;
}

export class GetVipReservationsResult implements IQueryResult {
  @ApiProperty({ type: [VipReservationResult] })
  data: VipReservationResult[];
}
