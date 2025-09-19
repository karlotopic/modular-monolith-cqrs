import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserManagementController } from './api/http/user-management.controller';
import { RegisterUserHandler } from './application/commands/register-user.command';
import { UserManagementRepository } from './infra/repositories/user-management.repository';
import { GetUserByEmailQueryHandler } from './application/queries/get-user-by-email.query';
import { UserExternalService } from './api/external';

const commands = [RegisterUserHandler];
const queries = [GetUserByEmailQueryHandler];

@Module({
  controllers: [UserManagementController],
  providers: [
    {
      provide: 'IUserRepository',
      useClass: UserManagementRepository,
    },
    {
      provide: 'IUserExternalService',
      useClass: UserExternalService,
    },
    ...commands,
    ...queries,
  ],
  imports: [forwardRef(() => AuthModule)],
  exports: ['IUserExternalService'],
})
export class UserManagementModule {}
