export interface IUserExternalService {
  getUserByEmail(email: string): Promise<{
    id: string;
    password: string;
  } | null>;
}
