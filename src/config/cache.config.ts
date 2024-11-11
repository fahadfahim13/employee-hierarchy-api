import { CacheModuleOptions, CacheStoreFactory } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

export const cacheConfig: CacheModuleOptions = {
  store: redisStore as unknown as CacheStoreFactory,
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  ttl: 300, // 5 minutes cache duration
  max: 1000, // maximum number of items in cache
};
