import { relations } from 'drizzle-orm';
import { integer, jsonb, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { importActionEnum } from '~/database/schemas/enums';
import { importJobs } from './import-jobs';

export const importJobRows = pgTable('import_job_rows', {
  id: uuid('id').defaultRandom().primaryKey(),
  jobId: uuid('job_id')
    .notNull()
    .references(() => importJobs.id),
  rowNumber: integer('row_number').notNull(),
  rowKey: varchar('row_key', { length: 100 }).notNull(),
  action: importActionEnum('action').notNull(),
  rawData: jsonb('raw_data').notNull(),
  normalizedData: jsonb('normalized_data'),
  diffData: jsonb('diff_data'),
  errorData: jsonb('error_data').$type<Array<{ field?: string; message: string }>>(),
});

// ==================== RELATIONSHIPS ====================

export const importJobRowRelations = relations(importJobRows, ({ one }) => ({
  importJob: one(importJobs, {
    fields: [importJobRows.jobId],
    references: [importJobs.id],
  }),
}));
