import { db } from '../config/db.js';

export type User = {
  id: string;
  email: string;
  password_hash: string;
  created_at: Date;
};

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const result = await db.query<User>(
      'SELECT id, email, password_hash, created_at FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] ?? null;
  }

  async create(email: string, passwordHash: string): Promise<Omit<User, 'password_hash'>> {
    const result = await db.query<Omit<User, 'password_hash'>>(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, passwordHash]
    );
    return result.rows[0];
  }
}
