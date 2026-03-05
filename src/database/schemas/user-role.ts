import { char, pgTable, primaryKey, varchar } from 'drizzle-orm/pg-core';
import { roles } from '~/database/schemas/roles';
import { users } from '~/database/schemas/users';

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
