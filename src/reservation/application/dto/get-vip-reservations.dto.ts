import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, Max, Min } from 'class-validator';

export class GetVipReservationsDto {
  @ApiProperty({
    description: 'Date from in ISO 8601 format (e.g., 2023-10-15).',
  })
  @Type(() => Date)
  @IsDate()
  dateFrom: Date;

  @ApiProperty({
    description: 'Date to in ISO 8601 format (e.g., 2023-10-20).',
  })
  @Type(() => Date)
  @IsDate()
  dateTo: Date;
}
