import { createClient, RedisClientType } from 'redis';
import { env } from './Env';

// Redis client instance
let redisClient: RedisClientType | null = null;

// Redis connection configuration
const redisConfig = {
  url: env.REDIS_URL || `redis://${env.REDIS_HOST}:${env.REDIS_PORT}`,
  password: env.REDIS_PASSWORD || undefined,
  database: parseInt(env.REDIS_DB) || 0,
  retry_strategy: (options: any) => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      // End reconnecting on a specific error and flush all commands with a individual error
      return new Error('The server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout and flush all commands with a individual error
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      // End reconnecting with built in error
      return undefined;
    }
    // Reconnect after
    return Math.min(options.attempt * 100, 3000);
  },
  socket: {
    connectTimeout: 10000,
    lazyConnect: true,
    keepAlive: true,
    family: 4,
    noDelay: true,
  },
};

/**
 * Initialize Redis client
 */
export async function initRedis(): Promise<RedisClientType> {
  try {
    if (redisClient && redisClient.isOpen) {
      return redisClient;
    }

    // Create new Redis client
    redisClient = createClient(redisConfig);

    // Event listeners
    redisClient.on('error', (err) => {
      console.error('❌ Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
    });

    redisClient.on('ready', () => {
    });

    redisClient.on('end', () => {
    });

    redisClient.on('reconnecting', () => {
    });

    // Connect to Redis
    await redisClient.connect();

    return redisClient;
  } catch (error) {
    console.error('❌ Failed to initialize Redis client:', error);
    throw error;
  }
}

/**
 * Get Redis client instance
 */
export async function getRedisClient(): Promise<RedisClientType> {
  if (!redisClient || !redisClient.isOpen) {
    return await initRedis();
  }
  return redisClient;
}

/**
 * Close Redis connection
 */
export async function closeRedis(): Promise<void> {
  try {
    if (redisClient && redisClient.isOpen) {
      await redisClient.quit();
      redisClient = null;
    }
  } catch (error) {
    console.error('❌ Error closing Redis connection:', error);
  }
}

/**
 * Test Redis connection
 */
export async function testRedisConnection(): Promise<boolean> {
  try {
    const client = await getRedisClient();
    await client.ping();
    return true;
  } catch (error) {
    console.error('❌ Redis connection test failed:', error);
    return false;
  }
}

/**
 * Utility function to set key-value pair with optional expiration
 */
export async function setKey(
  key: string, 
  value: string | number | object, 
  expirationSeconds?: number
): Promise<void> {
  try {
    const client = await getRedisClient();
    const serializedValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    
    if (expirationSeconds) {
      await client.setEx(key, expirationSeconds, serializedValue);
    } else {
      await client.set(key, serializedValue);
    }
  } catch (error) {
    console.error(`❌ Error setting key ${key}:`, error);
    throw error;
  }
}

/**
 * Utility function to get value by key
 */
export async function getKey<T = string>(key: string): Promise<T | null> {
  try {
    const client = await getRedisClient();
    const value = await client.get(key);
    
    if (value === null) return null;
    
    // Try to parse as JSON, fallback to string
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  } catch (error) {
    console.error(`❌ Error getting key ${key}:`, error);
    throw error;
  }
}

/**
 * Utility function to delete key
 */
export async function deleteKey(key: string): Promise<boolean> {
  try {
    const client = await getRedisClient();
    const result = await client.del(key);
    return result > 0;
  } catch (error) {
    console.error(`❌ Error deleting key ${key}:`, error);
    throw error;
  }
}

/**
 * Utility function to check if key exists
 */
export async function keyExists(key: string): Promise<boolean> {
  try {
    const client = await getRedisClient();
    const result = await client.exists(key);
    return result > 0;
  } catch (error) {
    console.error(`❌ Error checking key ${key}:`, error);
    throw error;
  }
}

/**
 * Utility function to set key expiration
 */
export async function setKeyExpiration(key: string, seconds: number): Promise<boolean> {
  try {
    const client = await getRedisClient();
    const result = await client.expire(key, seconds);
    return result === 1;
  } catch (error) {
    console.error(`❌ Error setting expiration for key ${key}:`, error);
    throw error;
  }
}

/**
 * Utility function to get key time to live
 */
export async function getKeyTTL(key: string): Promise<number> {
  try {
    const client = await getRedisClient();
    const ttl = await client.ttl(key);
    return ttl;
  } catch (error) {
    console.error(`❌ Error getting TTL for key ${key}:`, error);
    throw error;
  }
}

/**
 * Utility function to increment counter
 */
export async function incrementCounter(key: string, amount: number = 1): Promise<number> {
  try {
    const client = await getRedisClient();
    const result = await client.incrBy(key, amount);
    return result;
  } catch (error) {
    console.error(`❌ Error incrementing counter ${key}:`, error);
    throw error;
  }
}

/**
 * Utility function to get all keys matching pattern
 */
export async function getKeys(pattern: string): Promise<string[]> {
  try {
    const client = await getRedisClient();
    const keys = await client.keys(pattern);
    return keys;
  } catch (error) {
    console.error(`❌ Error getting keys with pattern ${pattern}:`, error);
    throw error;
  }
}

/**
 * Utility function to flush all keys (use with caution!)
 */
export async function flushAll(): Promise<void> {
  try {
    const client = await getRedisClient();
    await client.flushAll();
  } catch (error) {
    console.error('❌ Error flushing all keys:', error);
    throw error;
  }
}

// Graceful shutdown handling
process.on('SIGINT', async () => {
  await closeRedis();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeRedis();
  process.exit(0);
});

export default {
  initRedis,
  getRedisClient,
  closeRedis,
  testRedisConnection,
  setKey,
  getKey,
  deleteKey,
  keyExists,
  setKeyExpiration,
  getKeyTTL,
  incrementCounter,
  getKeys,
  flushAll,
};
