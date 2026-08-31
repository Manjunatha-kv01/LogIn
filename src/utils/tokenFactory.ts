import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { env } from '../config/env.js';

export type TokenPayload = { userId: string; sessionId: string };

export class TokenFactory {
  create(userId: string): { token: string; sessionId: string } {
    const sessionId = randomUUID();
    const token = jwt.sign({ userId, sessionId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
    return { token, sessionId };
  }

  verify(token: string): TokenPayload {
    return jwt.verify(token, env.jwtSecret) as TokenPayload;
  }
}
