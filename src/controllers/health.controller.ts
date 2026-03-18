import { Request, Response } from 'express';
import { healthService } from '~/services';
import { ApiResponse } from '~/utils';

// ==================== CHECK DETAIL ====================

const checkDetail = async (_req: Request, res: Response) => {
  const healthData = await healthService.getHealthDetail();
  return ApiResponse.Success(res, 'Service is healthy', healthData);
};

// ==================== CHECK LIVE ====================

const checkLive = (_req: Request, res: Response) => {
  res.sendStatus(200);
};

// ==================== CHECK READY ====================

const checkReady = (_req: Request, res: Response) => {
  return ApiResponse.Success(res, 'Service is healthy');
};

// ==================== EXPORT ====================

export const healthController = {
  checkDetail,
  checkLive,
  checkReady,
};
