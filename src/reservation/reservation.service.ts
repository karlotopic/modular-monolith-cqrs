import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/database/prisma.service';
import { GetVipReservationsDto } from './application/dto/get-vip-reservations.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReservationService {
  constructor(private prismaService: PrismaService) {}

  async getConfirmedVipRes(getBottlesOfChampange: GetVipReservationsDto) {
    const where: Prisma.ReservationWhereInput = {
      vip: true,
      status: 'CONFIRMED',
      arrival: {
        gte: getBottlesOfChampange.dateFrom,
        lte: getBottlesOfChampange.dateTo,
      },
    };

    const [reservations] = await this.prismaService.$transaction([
      this.prismaService.reservation.groupBy({
        by: ['propertyId'],
        _count: { propertyId: true },
        where,
        orderBy: {
          propertyId: 'asc',
        },
      }),
      // this.prismaService.reservation.count({ where }),
    ]);

    return {
      reservations: reservations.map((r) => ({
        propertyId: r.propertyId,
        numOfVipReservations: (r._count as { propertyId: number }).propertyId,
      })),
      totalNumOfVipReservations: reservations.reduce((acc, curr) => {
        return acc + (curr._count as { propertyId: number }).propertyId;
      }, 0),
    };
  }
}
