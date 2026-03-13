import Redis from 'ioredis';
import { env } from '~/configs';

export const redisConfig = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
};

export const redis = new Redis({
  ...redisConfig,
  connectTimeout: 5000,
  maxRetriesPerRequest: 2,
  retryStrategy: (times: number) => {
    return Math.min(times * 100, 2000);
  },
});
