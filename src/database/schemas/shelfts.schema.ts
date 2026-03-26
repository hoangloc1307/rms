import { relations } from 'drizzle-orm';
import { boolean, char, integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { racks } from '~/database/schemas/racks.schema';

// ==================== TABLE DEFINITIONS ====================

export const shelfts = pgTable('shelfts', {
  code: varchar('code', { length: 20 }).primaryKey(),
  rackCode: varchar('rack_code', { length: 20 })
    .notNull()
    .references(() => racks.code),
  name: varchar('name', { length: 150 }).notNull(),
  level: integer('level').notNull(),
  note: varchar('note', { length: 255 }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 0 }).defaultNow().notNull(),
  createdBy: char('created_by', { length: 8 }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, precision: 0 }),
  updatedBy: char('updated_by', { length: 8 }),
});

// ==================== RELATIONSHIPS ====================

export const shelftRelations = relations(shelfts, ({ one }) => ({
  rack: one(racks, {
    fields: [shelfts.rackCode],
    references: [racks.code],
  }),
}));
