import { boolean, char, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const roles = pgTable('roles', {
  code: varchar('code', { length: 50 }).primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 0 }).defaultNow().notNull(),
  createdBy: char('created_by', { length: 8 }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, precision: 0 }),
  updatedBy: char('updated_by', { length: 8 }),
});
