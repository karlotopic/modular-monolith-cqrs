import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { emailSchema, passwordSchema } from '../../domain/validation';
import { z } from 'zod';
import { IUserRepository } from '../../domain/interfaces/user.repository';
import { User } from '../../domain/entities/user.entity';
import { UserExistsException } from '../../domain/exceptions/user-exists.exceptions';
import { IUUIDProvider } from '../../../shared/uuid.provider';
import { IAuthExternalService } from '../../domain/interfaces/auth-external.interface';
import { ICryptoProvider } from '../../../shared/crypto.provider';

export class RegisterUserCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}

const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements
    ICommandHandler<
      RegisterUserCommand,
      { userId: string; accessToken: string; refreshToken: string }
    >
{
  constructor(
    @Inject('IUserRepository') private userRepository: IUserRepository,
    @Inject('IUUIDProvider') private uuidProvider: IUUIDProvider,
    private eventPublisher: EventPublisher,
    @Inject('IAuthExternalService')
    private authExternalService: IAuthExternalService,
    @Inject('ICryptoProvider')
    private cryptoProvider: ICryptoProvider,
  ) {}

  async execute(
    command: RegisterUserCommand,
  ): Promise<{ userId: string; accessToken: string; refreshToken: string }> {
    const { email, password } = await createUserSchema.parseAsync(command);

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) throw new UserExistsException(email);

    const userPassword = await this.cryptoProvider.generateHash(password);
    const user = this.eventPublisher.mergeObjectContext(
      new User(this.uuidProvider.generate(), email, userPassword),
    );
    await this.userRepository.create(user);

    const { accessToken, refreshToken } =
      await this.authExternalService.authenticateUser(user.id, user.email);

    user.commit();

    return { userId: user.id, accessToken, refreshToken };
  }
}
