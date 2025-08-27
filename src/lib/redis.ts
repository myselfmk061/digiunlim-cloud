import { Redis } from '@upstash/redis';

function getRedisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  
  if (!url || !token) {
    throw new Error('Upstash Redis credentials are not configured in environment variables.');
  }
  
  return new Redis({ url, token });
}

export const redis = getRedisClient();
