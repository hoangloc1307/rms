import { boolean, char, decimal, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { itemTrackingTypeEnum } from '~/database/schemas/enums';

// ==================== TABLE DEFINITIONS ====================

export const items = pgTable('items', {
  itemCode: varchar('item_code', { length: 10 }).primaryKey(),
  productCode: char('product_code', { length: 4 }).notNull(),
  name: varchar('name', { length: 150 }).notNull(),
  unit: varchar('unit', { length: 20 }).notNull(),
  baseUnit: varchar('base_unit', { length: 20 }).notNull(),
  conversionFactor: decimal('conversion_factor', { precision: 18, scale: 3 }).notNull().default('1'),
  deliveryOnBaseUnit: boolean('delivery_on_base_unit').notNull().default(true),
  trackingType: itemTrackingTypeEnum('tracking_type').notNull(),
  note: varchar('note', { length: 255 }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 0 }).defaultNow().notNull(),
  createdBy: char('created_by', { length: 8 }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, precision: 0 }),
  updatedBy: char('updated_by', { length: 8 }),
});
