import { boolean, char, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const features = pgTable('features', {
  code: varchar('code', { length: 100 }).primaryKey(),
  name: varchar('name', { length: 150 }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 0 }).defaultNow().notNull(),
  createdBy: char('created_by', { length: 8 }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, precision: 0 }),
  updatedBy: char('updated_by', { length: 8 }),
});
