import { app } from './app.js';
import { env } from './config/env.js';
import { redis } from './config/redis.js';

await redis.connect();

app.listen(env.port, () => {
  console.log(`Login service running on http://localhost:${env.port}`);
});
