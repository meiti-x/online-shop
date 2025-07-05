import Redis from 'ioredis';

import { getConfig } from '../configs';

let redisClient: Redis | null = null;

export function getRedisClient(): Redis {
  const { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } = getConfig();
  if (!redisClient) {
    redisClient = new Redis({
      host: REDIS_HOST,
      port: REDIS_PORT,
      password: REDIS_PASSWORD || undefined,
      maxRetriesPerRequest: null,
      enableOfflineQueue: false,
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis connected');
    });

    redisClient.on('error', (err) => {
      console.error('❌ Redis error:', err);
    });
  }

  return redisClient;
}
