import { relations } from 'drizzle-orm';
import { boolean, char, pgTable, primaryKey, timestamp, varchar } from 'drizzle-orm/pg-core';
import { actionEnum, decisionEnum } from './enums';
import { features } from './features.schema';
import { users } from './users.schema';

// ==================== TABLE DEFINITIONS ====================

export const userPermissions = pgTable(
  'user_permission',
  {
    username: char('username', { length: 8 })
      .notNull()
      .references(() => users.username),
    featureCode: varchar('feature_code', { length: 100 })
      .notNull()
      .references(() => features.code),
    action: actionEnum('action').notNull(),
    decision: decisionEnum('decision').notNull(),
    sectionCode: char('section_code', { length: 4 }).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      precision: 0,
    })
      .defaultNow()
      .notNull(),
    createdBy: char('created_by', { length: 8 }).notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      precision: 0,
    }),
    updatedBy: char('updated_by', { length: 8 }),
  },
  (table) => [
    primaryKey({
      columns: [table.username, table.featureCode, table.action, table.sectionCode],
    }),
  ],
);

// ==================== RELATIONSHIPS ====================

export const userPermissionRelations = relations(userPermissions, ({ one }) => ({
  user: one(users, {
    fields: [userPermissions.username],
    references: [users.username],
  }),
  feature: one(features, {
    fields: [userPermissions.featureCode],
    references: [features.code],
  }),
}));
