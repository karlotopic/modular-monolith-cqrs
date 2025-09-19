import { decode, sign, verify } from 'jsonwebtoken';

export interface IJwtProvider {
  generateTokens(payload: object): {
    refreshToken: string;
    accessToken: string;
  };
  verifyToken(token: string): object | string;
  decodeToken(token: string): object | string | null;
}

export class JWtProvider implements IJwtProvider {
  generateTokens(payload: { email: string; sub: string }): {
    refreshToken: string;
    accessToken: string;
  } {
    const accessToken = sign(payload, 'secret', {
      expiresIn: '1h',
    });
    const refreshToken = sign(payload, 'secret', {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  verifyToken(token: string): object | string {
    return verify(token, 'secret');
  }

  decodeToken(token: string): object | string | null {
    return decode(token);
  }
}
