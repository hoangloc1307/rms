import { redis } from '~/configs';

// ==================== SET ====================

const set = async (key: string, value: unknown, ttl?: number) => {
  const data = JSON.stringify(value);

  if (ttl) {
    await redis.set(key, data, 'EX', ttl);
  } else {
    await redis.set(key, data);
  }
};

// ==================== GET ====================

const get = async (key: string): Promise<unknown> => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

// ==================== DELETE ====================

const del = async (key: string) => {
  await redis.del(key);
};

// ==================== EXPORT ====================

export const cacheService = {
  set,
  get,
  del,
};
