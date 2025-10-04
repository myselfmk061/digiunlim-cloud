import { Redis } from '@upstash/redis';

// This function ensures that we only create one instance of the Redis client.
function getRedisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  
  if (!url || !token) {
    // This error will be thrown if the required environment variables are not set.
    // It's a critical error because the application cannot function without Redis.
    throw new Error('Upstash Redis credentials are not configured in environment variables. Please check your .env file.');
  }
  
  // Create and return a new Redis client instance from Upstash.
  return new Redis({ url, token });
}

// Export a single, memoized instance of the Redis client.
// This instance will be reused across the application.
export const redis = getRedisClient();
