import { pgTable, varchar, char, boolean, timestamp, primaryKey, pgEnum } from 'drizzle-orm/pg-core';
import { roles } from './roles';
import { features } from './features';

export const actionEnum = pgEnum('action', ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE', 'APPROVAL']);

export const decisionEnum = pgEnum('decision', ['ALLOW', 'DENY']);

export const rolePermissions = pgTable(
  'role_permission',
  {
    roleCode: varchar('role_code', { length: 50 })
      .notNull()
      .references(() => roles.code),
    featureCode: varchar('feature_code', { length: 100 })
      .notNull()
      .references(() => features.code),
    action: actionEnum('action').notNull(),
    sectionCode: char('section_code', { length: 4 }).notNull(),
    decision: decisionEnum('decision').notNull(),
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
      columns: [table.roleCode, table.featureCode, table.action, table.sectionCode],
    }),
  ],
);
