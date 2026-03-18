import { sql } from 'drizzle-orm';
import prettyMs from 'pretty-ms';
import { env, redis } from '~/configs';
import { db } from '~/database';

const checkPostgresql = async () => {
  try {
    await db.execute(sql`SELECT 1`);
    return 'healthy';
  } catch {
    return 'unhealthy';
  }
};

const checkRedis = () => {
  return redis.status === 'ready' ? 'healthy' : 'unhealthy';
};

// ==================== GET HEALTH DETAIL ====================

const getHealthDetail = async () => {
  const healthData = {
    timestamp: new Date().toISOString(),
    uptimeSeconds: process.uptime(),
    uptimeString: prettyMs(process.uptime() * 1000),
    environment: env.ENVIRONMENT,
    version: env.VERSION,
    memory: {
      used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
      total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
      unit: 'MB',
    },
    cpu: {
      usage: process.cpuUsage(),
    },
    checks: {
      postgresql: await checkPostgresql(),
      redis: checkRedis(),
    },
  };

  return healthData;
};

// ==================== EXPORT ====================

export const healthService = {
  getHealthDetail,
};
