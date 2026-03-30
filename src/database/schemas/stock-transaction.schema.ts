import { relations } from 'drizzle-orm';
import { char, decimal, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { itemTrackingTypeEnum, stockTransactionTypeEnum } from '~/database/schemas/enums';
import { inventoryUnits } from '~/database/schemas/inventory-unit.schema';
import { items } from '~/database/schemas/items.schema';
import { shelves } from '~/database/schemas/shelves.schema';

// ==================== TABLE DEFINITIONS ====================

export const stockTransactions = pgTable('stock_transaction', {
  id: uuid('id').defaultRandom().primaryKey(),
  itemCode: varchar('item_code', { length: 10 })
    .notNull()
    .references(() => items.itemCode),
  inventoryUnitId: uuid('inventory_unit_id').references(() => inventoryUnits.id),
  fromShelfCode: varchar('from_shelf_code', { length: 20 }).references(() => shelves.code),
  toShelfCode: varchar('to_shelf_code', { length: 20 }).references(() => shelves.code),
  type: stockTransactionTypeEnum('type').notNull(),
  trackingType: itemTrackingTypeEnum('tracking_type').notNull(),
  quantity: decimal('quantity', { precision: 18, scale: 3 }).notNull(),
  referenceCode: varchar('reference_code', { length: 100 }),
  confirmedAt: timestamp('confirmed_at', { withTimezone: true, precision: 0 }),
  confirmedBy: char('confirmed_by', { length: 8 }),
  note: varchar('note', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 0 }).defaultNow().notNull(),
  createdBy: char('created_by', { length: 8 }).notNull(),
});

// ==================== RELATIONSHIPS ====================

export const stockTransactionRelations = relations(stockTransactions, ({ one }) => ({
  item: one(items, {
    fields: [stockTransactions.itemCode],
    references: [items.itemCode],
  }),
  inventoryUnit: one(inventoryUnits, {
    fields: [stockTransactions.inventoryUnitId],
    references: [inventoryUnits.id],
  }),
  fromShelf: one(shelves, {
    fields: [stockTransactions.fromShelfCode],
    references: [shelves.code],
  }),
  toShelf: one(shelves, {
    fields: [stockTransactions.toShelfCode],
    references: [shelves.code],
  }),
}));
