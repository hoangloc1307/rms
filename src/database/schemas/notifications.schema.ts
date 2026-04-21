import { relations } from 'drizzle-orm';
import { boolean, char, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { notificationEntityEnum, notificationTypeEnum } from '~/database/schemas/enums';
import { users } from '~/database/schemas/users.schema';

// ==================== TABLE DEFINITIONS ====================

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: char('user_id', { length: 8 })
    .notNull()
    .references(() => users.username),
  type: notificationTypeEnum('type').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  content: varchar('content', { length: 255 }).notNull(),
  entityType: notificationEntityEnum('entity_type'),
  entityId: varchar('entity_id', { length: 255 }),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 0 }).defaultNow().notNull(),
});

// ==================== RELATIONSHIPS ====================

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.username],
  }),
}));
