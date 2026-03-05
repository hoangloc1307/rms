import { pgTable, char, varchar, boolean, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { users } from './users';
import { features } from './features';
import { actionEnum, decisionEnum } from './role-permission';

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
