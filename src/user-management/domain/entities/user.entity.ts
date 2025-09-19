import { AggregateRoot } from '@nestjs/cqrs';
import { UserCreatedEvent } from '../events/user-created.event';

export class User extends AggregateRoot {
  id: string;

  email: string;

  password: string;

  constructor(uuid: string, email: string, password: string) {
    super();
    this.id = uuid;
    this.email = email;
    this.password = password;

    this.apply(new UserCreatedEvent(uuid, email, password));
  }
}
