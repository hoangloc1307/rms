import { boolean, char, integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

// ==================== TABLE DEFINITIONS ====================

export const itemMasters = pgTable('item_masters', {
  itemCode: char('item_code', { length: 10 }).primaryKey(),
  productCode: char('product_code', { length: 10 }).notNull(),
  name: varchar('name', { length: 150 }).notNull(),
  unit: varchar('unit', { length: 20 }).notNull(),
  baseUnit: varchar('base_unit', { length: 20 }).notNull(),
  conversionFactor: integer('conversion_factor').notNull().default(1),
  deliveryOnBaseUnit: boolean('delivery_on_base_unit').notNull().default(true),
  note: varchar('note', { length: 255 }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 0 }).defaultNow().notNull(),
  createdBy: char('created_by', { length: 8 }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, precision: 0 }),
  updatedBy: char('updated_by', { length: 8 }),
});
