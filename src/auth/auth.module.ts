import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './api/http/auth.controller';
import { AuthExternalService } from './api/external';
import { UserManagementModule } from '../user-management/user-management.module';
import { AuthService } from './auth.service';
import { TokenRepository } from './token.repository';

// I itentionaly decided to leave this module in a flat structure as it's a supportive domain.

// In a production grade scenario, we wouldn't build the authentication flow ground up.
// Rather, we would use a third party provider like Auth0 for user authentication and management.
// The circular dependency between AuthModule and UserManagementModule wouldn't exist then.

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'IAuthExternalService',
      useClass: AuthExternalService,
    },
    TokenRepository,
  ],
  imports: [forwardRef(() => UserManagementModule)],
  exports: ['IAuthExternalService'],
})
export class AuthModule {}
