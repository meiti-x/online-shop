import Redis from 'ioredis';

import { getConfig } from '../configs';
import { getLogger } from '../logger';
import { setupRedisFeatures } from './redisFeatureSetup';

let redisClient: Redis | null = null;

export function getRedisClient(): Redis {
  const { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } = getConfig();
  const logger = getLogger();
  if (!redisClient) {
    redisClient = new Redis({
      host: REDIS_HOST,
      port: REDIS_PORT,
      password: REDIS_PASSWORD || undefined,
      maxRetriesPerRequest: null,
      enableOfflineQueue: false,
    });

    redisClient.on('connect', () => {
      logger.info('✅ Redis connected');
    });

    redisClient.on('ready', () => {
      logger.info('🔌 Redis is Ready');
      setupRedisFeatures(redisClient);
    });

    redisClient.on('disconnect', () => {
      logger.info('🔌❌ Redis disconnected');
    });

    redisClient.on('error', (err) => {
      logger.error('❌ Redis error:', err);
    });
  }

  return redisClient;
}
