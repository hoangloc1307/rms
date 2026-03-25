import { relations } from 'drizzle-orm';
import { boolean, char, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { racks } from '~/database/schemas/racks.schema';
import { warehouses } from '~/database/schemas/warehouses.schema';

// ==================== TABLE DEFINITIONS ====================

export const zones = pgTable('zones', {
  code: varchar('code', { length: 20 }).primaryKey(),
  warehouseCode: varchar('warehouse_code', { length: 20 })
    .notNull()
    .references(() => warehouses.code),
  name: varchar('name', { length: 150 }).notNull(),
  note: varchar('note', { length: 255 }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 0 }).defaultNow().notNull(),
  createdBy: char('created_by', { length: 8 }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, precision: 0 }),
  updatedBy: char('updated_by', { length: 8 }),
});

// ==================== RELATIONSHIPS ====================

export const zoneRelations = relations(zones, ({ many, one }) => ({
  warehouse: one(warehouses, {
    fields: [zones.warehouseCode],
    references: [warehouses.code],
  }),
  racks: many(racks),
}));
