import { boolean, char, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  username: char('username', { length: 8 }).primaryKey(),
  name: varchar('name', { length: 100 }),
  email: varchar('email', { length: 254 }).unique(),
  password: varchar('password', { length: 255 }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 0 }).defaultNow().notNull(),
  createdBy: char('created_by', { length: 8 }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, precision: 0 }),
  updatedBy: char('updated_by', { length: 8 }),
});
