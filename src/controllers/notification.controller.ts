import { Request, Response } from 'express';
import { notificationService } from '~/services';
import { ApiResponse } from '~/utils';
import { GetNotificationSchemaQuery } from '~/validations';

// ==================== GET ALL ====================

const getAll = async (req: Request, res: Response) => {
  const { limit, cursor, isRead, type, entityType } = req.validatedData?.query as GetNotificationSchemaQuery;
  const userId = req.user?.userId;

  const data = await notificationService.getAll({
    limit,
    cursor,
    isRead,
    type,
    entityType,
    userId,
  });

  ApiResponse.ok(res, 'OK', data);
};

// ==================== EXPORT ====================

export const notificationController = {
  getAll,
};
