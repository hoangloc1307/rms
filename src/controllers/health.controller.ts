import { Request, Response } from 'express';
import { ApiResponse } from '~/utils';
import prettyMs from 'pretty-ms';
import { env } from '~/configs';

export const healthCheck = async (_req: Request, res: Response) => {
  const healthData = {
    status: 'healthy',
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
      database: await checkDatabase(),
    },
  };

  const allHealthy = Object.values(healthData.checks).every((status) => status === 'healthy');

  if (!allHealthy) {
    healthData.status = 'degraded';
    return ApiResponse.Error(res, 'Service is degraded', healthData);
  }

  return ApiResponse.Success(res, 'Service is healthy', healthData);
};

async function checkDatabase(): Promise<string> {
  try {
    // Database check logic
    await Promise.resolve('healthy');
    return 'healthy';
  } catch {
    return 'unhealthy';
  }
}

export const healthController = {
  healthCheck,
};
