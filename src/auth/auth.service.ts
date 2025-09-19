import { Injectable, Inject } from '@nestjs/common';
import { IJwtProvider } from '../shared/jwt.provider';
import { TokenRepository } from './token.repository';
import { IUserExternalService } from './user-external.interface';
import { ICryptoProvider } from '../shared/crypto.provider';
import { JsonWebTokenError } from 'jsonwebtoken';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { WrongPasswordException } from './exceptions/wrong-password.exception';
import { InvalidRefreshTokenException } from './exceptions/invalid-refresh-token.exception';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IJwtProvider') private jwtProvider: IJwtProvider,
    private tokenRepository: TokenRepository,
    @Inject('IUserExternalService')
    private userExternalService: IUserExternalService,
    @Inject('ICryptoProvider') private cryptoProvider: ICryptoProvider,
  ) {}

  async register(userId: string, email: string) {
    const { accessToken, refreshToken } = this.jwtProvider.generateTokens({
      sub: userId,
      email,
    });
    await this.tokenRepository.upsertRefreshToken(userId, refreshToken);

    return { accessToken, refreshToken };
  }

  async login(email: string, password: string) {
    const user = await this.userExternalService.getUserByEmail(email);

    if (!user) {
      throw new UserNotFoundException(email);
    }

    const isMatching = await this.cryptoProvider.compareHash(
      password,
      user.password,
    );

    if (!isMatching) {
      throw new WrongPasswordException(user.id);
    }

    const { accessToken, refreshToken } = this.jwtProvider.generateTokens({
      sub: user.id,
      email,
    });

    await this.tokenRepository.upsertRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string, userId: string) {
    try {
      this.jwtProvider.verifyToken(refreshToken);
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        throw new InvalidRefreshTokenException(userId);
      }
    }

    const tokenDb = await this.tokenRepository.getRefreshToken(
      userId,
      refreshToken,
    );
    if (!tokenDb) throw new InvalidRefreshTokenException(userId);

    const payload = this.jwtProvider.decodeToken(refreshToken) as any;
    const { accessToken, refreshToken: newRefreshToken } =
      this.jwtProvider.generateTokens({
        sub: tokenDb.userId,
        email: payload.email,
      });

    await this.tokenRepository.upsertRefreshToken(userId, newRefreshToken);
    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
