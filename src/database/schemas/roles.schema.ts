import { relations } from 'drizzle-orm';
import { boolean, char, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { rolePermissions } from '~/database/schemas/role-permission.schema';
import { userRoles } from '~/database/schemas/user-role.schema';

// ==================== TABLE DEFINITIONS ====================

export const roles = pgTable('roles', {
  code: varchar('code', { length: 50 }).primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 0 }).defaultNow().notNull(),
  createdBy: char('created_by', { length: 8 }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, precision: 0 }),
  updatedBy: char('updated_by', { length: 8 }),
});

// ==================== RELATIONSHIPS ====================

export const roleRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
  rolePermissions: many(rolePermissions),
}));
