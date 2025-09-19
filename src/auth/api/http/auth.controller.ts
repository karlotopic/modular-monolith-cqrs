import { AuthService } from '../../auth.service';
import {
  Body,
  Controller,
  Post,
  HttpCode,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { AuthDto, RefreshTokenDto } from './dto';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception';
import { WrongPasswordException } from '../../exceptions/wrong-password.exception';
import { InvalidRefreshTokenException } from '../../exceptions/invalid-refresh-token.exception';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @HttpCode(200)
  async signIn(@Body() authDto: AuthDto) {
    try {
      return await this.authService.login(authDto.email, authDto.password);
    } catch (error) {
      // this can be further extrapolated into a mapper
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (
        error instanceof WrongPasswordException ||
        error instanceof InvalidRefreshTokenException
      ) {
        throw new UnauthorizedException();
      }
    }
  }

  @Post('/refresh')
  async refreshToken(@Body() refreshDto: RefreshTokenDto) {
    try {
      return await this.authService.refreshToken(
        refreshDto.refreshToken,
        refreshDto.userId,
      );
    } catch (error) {
      if (error instanceof InvalidRefreshTokenException) {
        throw new UnauthorizedException();
      }
      throw error;
    }
  }
}
