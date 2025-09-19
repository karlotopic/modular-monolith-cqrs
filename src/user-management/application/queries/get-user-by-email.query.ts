import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IUserRepository } from '../../domain/interfaces/user.repository';
import z from 'zod';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { User } from '../../domain/entities/user.entity';

export class GetUserByEmailQuery {
  constructor(public readonly email: string) {}
}

const getUserByEmailSchema = z.object({
  email: z.email(),
});

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailQueryHandler
  implements IQueryHandler<GetUserByEmailQuery, User | null>
{
  constructor(
    @Inject('IUserRepository') private userRepository: IUserRepository,
  ) {}

  async execute(query: GetUserByEmailQuery): Promise<User | null> {
    const { email } = getUserByEmailSchema.parse(query);

    return this.userRepository.findByEmail(email);
  }
}
