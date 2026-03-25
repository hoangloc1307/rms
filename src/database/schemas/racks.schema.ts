import { relations } from 'drizzle-orm';
import { boolean, char, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { shelfts } from '~/database/schemas/shelfts.schema';
import { zones } from '~/database/schemas/zones.schema';

// ==================== TABLE DEFINITIONS ====================

export const racks = pgTable('racks', {
  code: varchar('code', { length: 20 }).primaryKey(),
  zoneCode: varchar('zone_code', { length: 20 })
    .notNull()
    .references(() => zones.code),
  name: varchar('name', { length: 150 }).notNull(),
  note: varchar('note', { length: 255 }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 0 }).defaultNow().notNull(),
  createdBy: char('created_by', { length: 8 }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, precision: 0 }),
  updatedBy: char('updated_by', { length: 8 }),
});

// ==================== RELATIONSHIPS ====================

export const rackRelations = relations(racks, ({ many, one }) => ({
  zone: one(zones, {
    fields: [racks.zoneCode],
    references: [zones.code],
  }),
  shelfts: many(shelfts),
}));
