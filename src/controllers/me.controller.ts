import { Request, Response } from 'express';
import { meService } from '~/services';
import { ApiResponse } from '~/utils';

// ==================== GET ME ====================

const getMe = async (req: Request, res: Response) => {
  const { user, menus, permissions } = await meService.getMe(req.user.userId);
  ApiResponse.ok(res, 'OK', { user, menus, permissions });
};

// ==================== EXPORT ====================

export const meController = {
  getMe,
};
