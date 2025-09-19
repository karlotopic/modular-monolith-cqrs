import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserByEmailQuery } from '../application/queries/get-user-by-email.query';

@Injectable()
export class UserExternalService {
  constructor(private queryBus: QueryBus) {}

  async getUserByEmail(email: string): Promise<{
    id: number;
    password: string;
  } | null> {
    const user = await this.queryBus.execute(new GetUserByEmailQuery(email));

    if (!user) return null;
    return {
      id: user.id,
      password: user.password,
    };
  }
}
