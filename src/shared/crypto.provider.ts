import { hash, genSalt, compare } from 'bcrypt';

export interface ICryptoProvider {
  generateHash(payload: any): Promise<string>;
  compareHash(payload: string, hashed: string): Promise<boolean>;
}

export class CryptoProvider implements ICryptoProvider {
  async generateHash(payload: any): Promise<string> {
    const salt = await genSalt();
    return hash(payload, salt);
  }

  async compareHash(payload: string, hashedContent: string): Promise<boolean> {
    return compare(payload, hashedContent);
  }
}
