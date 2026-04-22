import { and, count, desc, eq, lt, SQL } from 'drizzle-orm';
import { db } from '~/database';
import { notifications } from '~/database/schemas';
import { NotificationEntity, NotificationType } from '~/database/schemas/enums';

// ==================== GET ALL ====================

type GetAllNotificationParams = {
  limit: number;
  cursor?: string;
  isRead?: boolean;
  type?: NotificationType;
  entityType?: NotificationEntity;
  userId: string;
};

const getAll = async (params: GetAllNotificationParams) => {
  const { limit, cursor, isRead, type, entityType, userId } = params;
  const where: SQL[] = [];

  if (isRead !== undefined) {
    where.push(eq(notifications.isRead, isRead));
  }

  if (type) {
    where.push(eq(notifications.type, type));
  }

  if (entityType) {
    where.push(eq(notifications.entityType, entityType));
  }

  if (cursor) {
    where.push(lt(notifications.createdAt, new Date(cursor)));
  }

  const result = await db.query.notifications.findMany({
    where: and(eq(notifications.userId, userId), ...where),
    limit,
    orderBy: desc(notifications.createdAt),
  });

  return result;
};

// ==================== GET UNREAD COUNT ====================

const getUnreadCount = async (userId: string) => {
  const [{ count: totalUnread }] = await db
    .select({ count: count() })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));

  return totalUnread;
};

// ==================== CREATE NOTIFICATION ====================

type CreateNotificationParams = {
  userId: string;
  type: NotificationType;
  entityType: NotificationEntity;
  entityId: string;
  title: string;
  content: string;
};

const createNotification = async (params: CreateNotificationParams) => {
  const { userId, type, entityType, entityId, title, content } = params;
  const result = await db.insert(notifications).values({
    userId,
    type,
    entityType,
    entityId,
    title,
    content,
    isRead: false,
  });
  return result;
};

// ==================== EXPORT ====================

export const notificationService = {
  getAll,
  getUnreadCount,
  createNotification,
};
