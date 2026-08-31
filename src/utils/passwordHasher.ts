import bcrypt from 'bcryptjs';

export class PasswordHasher {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async verify(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }
}
