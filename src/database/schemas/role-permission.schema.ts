import { relations } from 'drizzle-orm';
import { boolean, char, pgTable, primaryKey, timestamp, varchar } from 'drizzle-orm/pg-core';
import { actionEnum, decisionEnum } from './enums';
import { features } from './features.schema';
import { roles } from './roles.schema';

// ==================== TABLE DEFINITIONS ====================

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

// ==================== RELATIONSHIPS ====================

export const rolePermissionRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolePermissions.roleCode],
    references: [roles.code],
  }),
  feature: one(features, {
    fields: [rolePermissions.featureCode],
    references: [features.code],
  }),
}));
