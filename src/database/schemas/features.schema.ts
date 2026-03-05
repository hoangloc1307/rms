import { relations } from 'drizzle-orm';
import { boolean, char, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { rolePermissions } from '~/database/schemas/role-permission.schema';
import { userPermissions } from '~/database/schemas/user-permission.schema';

// ==================== TABLE DEFINITIONS ====================

export const features = pgTable('features', {
  code: varchar('code', { length: 100 }).primaryKey(),
  name: varchar('name', { length: 150 }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 0 }).defaultNow().notNull(),
  createdBy: char('created_by', { length: 8 }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, precision: 0 }),
  updatedBy: char('updated_by', { length: 8 }),
});

// ==================== RELATIONSHIPS ====================

export const featureRelations = relations(features, ({ many }) => ({
  userPermissions: many(userPermissions),
  rolePermissions: many(rolePermissions),
}));
