export class InvalidRefreshTokenException extends Error {
  constructor(userId: string) {
    super(`Invalid refresh token provided for user: ${userId}`);
    this.name = this.constructor.name;
  }
}
