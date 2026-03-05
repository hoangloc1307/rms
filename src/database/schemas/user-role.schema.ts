import { relations } from 'drizzle-orm';
import { char, pgTable, primaryKey, varchar } from 'drizzle-orm/pg-core';
import { roles } from '~/database/schemas/roles.schema';
import { users } from '~/database/schemas/users.schema';

// ==================== TABLE DEFINITIONS ====================

export const userRoles = pgTable(
  'user_role',
  {
    username: char('username', { length: 8 })
      .notNull()
      .references(() => users.username),
    roleCode: varchar('role_code', { length: 50 })
      .notNull()
      .references(() => roles.code),
    sectionCode: char('section_code', { length: 4 }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.username, table.roleCode, table.sectionCode] })],
);

// ==================== RELATIONSHIPS ====================

export const userRoleRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.username],
    references: [users.username],
  }),
  role: one(roles, {
    fields: [userRoles.roleCode],
    references: [roles.code],
  }),
}));
