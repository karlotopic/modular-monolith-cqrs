import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../shared/database/prisma.service';
import { IReservationRepository } from '../../domain/interfaces/reservation.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReservationRepository implements IReservationRepository {
  constructor(private prismaService: PrismaService) {}

  async countConfirmedVipReservations(
    dateFrom: Date,
    dateTo: Date,
  ): Promise<{ propertyId: string; vipReservationCount: number }[]> {
    const where: Prisma.ReservationWhereInput = {
      vip: true,
      status: 'CONFIRMED',
      arrival: {
        gte: dateFrom,
        lte: dateTo,
      },
    };

    const reservations = await this.prismaService.reservation.groupBy({
      by: ['propertyId'],
      _count: { propertyId: true },
      where,
      orderBy: {
        propertyId: 'asc',
      },
    });

    return reservations.map((r) => ({
      propertyId: r.propertyId,
      vipReservationCount: (r._count as { propertyId: number }).propertyId,
    }));
  }
}
