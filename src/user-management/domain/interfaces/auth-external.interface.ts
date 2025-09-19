export interface IAuthExternalService {
  authenticateUser(
    userId: string,
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }>;
}
