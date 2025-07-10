import Redis from 'ioredis';

import { getLogger } from '../logger';

export async function setupRedisFeatures(redis: Redis | null) {
  if (!redis) throw new Error('Redis not initalized');
  const logger = getLogger();
  if (redis.status !== 'ready') {
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => redis.once('ready', resolve));
  }
  const BLOOM_KEY = 'user_emails';
  const EXISTS = await redis.exists(BLOOM_KEY);

  if (!EXISTS) {
    await redis.call('BF.RESERVE', BLOOM_KEY, '0.01', '1000000');

    logger.info(`✅ Bloom filter created for: ${BLOOM_KEY}`);
  } else {
    logger.info(`ℹ️ Bloom filter already exists: ${BLOOM_KEY}`);
  }
}
