import { relations } from 'drizzle-orm';
import { char, integer, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { importStatusEnum } from '~/database/schemas/enums';
import { importJobRows } from '~/database/schemas/import-job-rows';
import { users } from '~/database/schemas/users.schema';

export const importJobs = pgTable('import_jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  token: varchar('token', { length: 100 }).notNull().unique(),
  type: varchar('type', { length: 50 }).notNull(),
  status: importStatusEnum('status').notNull(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileUrl: varchar('file_url', { length: 255 }).notNull(),
  totalRows: integer('total_rows').notNull(),
  createdRows: integer('created_rows').notNull(),
  updatedRows: integer('updated_rows').notNull(),
  skippedRows: integer('skipped_rows').notNull(),
  errorRows: integer('error_rows').notNull(),
  expiredAt: timestamp('expired_at', { withTimezone: true, precision: 0 }).notNull(),
  committedAt: timestamp('committed_at', { withTimezone: true, precision: 0 }),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 0 }).defaultNow().notNull(),
  createdBy: char('created_by', { length: 8 })
    .notNull()
    .references(() => users.username),
});

// ==================== RELATIONSHIPS ====================

export const importJobRelations = relations(importJobs, ({ many, one }) => ({
  importJobRows: many(importJobRows),
  createdBy: one(users, {
    fields: [importJobs.createdBy],
    references: [users.username],
  }),
}));
