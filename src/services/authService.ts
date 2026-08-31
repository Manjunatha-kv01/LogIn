import { UserRepository } from '../repositories/userRepository.js';
import { PasswordHasher } from '../utils/passwordHasher.js';
import { TokenFactory } from '../utils/tokenFactory.js';
import { redis } from '../config/redis.js';

export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenFactory: TokenFactory
  ) {}

  async register(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await this.userRepo.findByEmail(normalizedEmail);
    if (existing) throw new Error('EMAIL_ALREADY_EXISTS');

    const passwordHash = await this.passwordHasher.hash(password);
    return this.userRepo.create(normalizedEmail, passwordHash);
  }

  async authenticate(email: string, plainPassword: string) {
    const user = await this.userRepo.findByEmail(email.trim().toLowerCase());
    if (!user) throw new Error('INVALID_CREDENTIALS');

    const valid = await this.passwordHasher.verify(plainPassword, user.password_hash);
    if (!valid) throw new Error('INVALID_CREDENTIALS');

    const { token, sessionId } = this.tokenFactory.create(user.id);
    await redis.set(`session:${sessionId}`, user.id, { EX: 3600 });

    return { token, sessionId, user: { id: user.id, email: user.email } };
  }

  async getUserFromToken(token: string) {
    const { userId, sessionId } = this.tokenFactory.verify(token);
    const activeUserId = await redis.get(`session:${sessionId}`);
    if (activeUserId !== userId) throw new Error('SESSION_REVOKED');
    return { userId, sessionId };
  }

  async logout(sessionId: string) {
    await redis.del(`session:${sessionId}`);
  }
}
