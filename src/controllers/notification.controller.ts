import { Request, Response } from 'express';
import { notificationService } from '~/services';
import { ApiResponse } from '~/utils';
import { GetNotificationSchemaQuery, MarkAsReadSchemaParams } from '~/validations';

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

// ==================== GET UNREAD COUNT ====================

const getUnreadCount = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  const count = await notificationService.getUnreadCount(userId);

  ApiResponse.ok(res, 'OK', { count });
};

// ==================== MARK AS READ ====================

const markAsRead = async (req: Request, res: Response) => {
  const { id } = req.validatedData?.params as MarkAsReadSchemaParams;

  await notificationService.markAsRead(id);

  ApiResponse.ok(res, 'OK');
};

// ==================== EXPORT ====================

export const notificationController = {
  getAll,
  getUnreadCount,
  markAsRead,
};
