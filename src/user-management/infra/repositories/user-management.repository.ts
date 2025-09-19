import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/interfaces/user.repository';
import { User } from '../../domain/entities/user.entity';
import { PrismaService } from '../../../shared/database/prisma.service';

@Injectable()
export class UserManagementRepository implements IUserRepository {
  constructor(private prismaService: PrismaService) {}
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return null;
    return new User(user.id, user.email, user.password);
  }

  async create(user: User): Promise<User> {
    const createdUser = await this.prismaService.user.create({
      data: {
        id: user.id,
        email: user.email,
        password: user.password,
      },
    });

    return new User(createdUser.id, createdUser.email, createdUser.password);
  }
}
