import { Request, Response } from 'express';
import { meService } from '~/services';
import { ApiResponse } from '~/utils';

// ==================== GET ME ====================

const getMe = async (req: Request, res: Response) => {
  const user = await meService.getMe(req.user.userId);
  ApiResponse.ok(res, 'OK', user);
};

// ==================== EXPORT ====================

export const meController = {
  getMe,
};
