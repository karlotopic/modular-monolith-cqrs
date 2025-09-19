import { Injectable } from '@nestjs/common';
import { RefreshToken } from '@prisma/client';
import { PrismaService } from '../shared/database/prisma.service';

@Injectable()
export class TokenRepository {
  constructor(private prismaService: PrismaService) {}

  upsertRefreshToken(userId: string, token: string) {
    return this.prismaService.refreshToken.upsert({
      where: {
        userId,
      },
      update: {
        token,
      },
      create: {
        userId,
        token,
      },
    });
  }

  getRefreshToken(userId: string, token: string) {
    return this.prismaService.refreshToken.findFirst({
      where: {
        token,
        userId,
      },
    });
  }

  deleteRefreshToken(userId: string) {
    return this.prismaService.refreshToken.delete({
      where: {
        userId,
      },
    });
  }
}
