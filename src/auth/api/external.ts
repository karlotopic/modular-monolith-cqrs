import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthExternalService {
  constructor(private authService: AuthService) {}

  async authenticateUser(
    userId: string,
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.register(userId, email);
  }
}
