import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL ?? 'postgres://app:app@localhost:5432/login_app',
  redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',
  jwtSecret: process.env.JWT_SECRET ?? 'dev-only-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1h'
};
