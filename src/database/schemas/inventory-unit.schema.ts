import { relations } from 'drizzle-orm';
import { boolean, char, decimal, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { inventoryUnitStatusEnum } from '~/database/schemas/enums';
import { items } from '~/database/schemas/items.schema';
import { shelves } from '~/database/schemas/shelves.schema';
import { stockTransactions } from '~/database/schemas/stock-transaction.schema';

// ==================== TABLE DEFINITIONS ====================

export const inventoryUnits = pgTable('inventory_unit', {
  id: uuid('id').defaultRandom().primaryKey(),
  tagCode: varchar('tag_code', { length: 255 }).notNull().unique(),
  itemCode: varchar('item_code', { length: 10 })
    .notNull()
    .references(() => items.itemCode),
  shelfCode: varchar('shelf_code', { length: 20 })
    .notNull()
    .references(() => shelves.code),
  lot: varchar('lot', { length: 30 }),
  poNo: varchar('po_no', { length: 30 }),
  invoiceNo: varchar('invoice_no', { length: 30 }),
  quantity: decimal('quantity', { precision: 18, scale: 3 }).notNull(),
  inspectedDate: timestamp('inspected_date', { withTimezone: true, precision: 0 }),
  expiryDate: timestamp('expiry_date', { withTimezone: true, precision: 0 }),
  status: inventoryUnitStatusEnum('status').notNull().default('NORMAL'),
  note: varchar('note', { length: 255 }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 0 }).defaultNow().notNull(),
  createdBy: char('created_by', { length: 8 }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, precision: 0 }),
  updatedBy: char('updated_by', { length: 8 }),
});

// ==================== RELATIONSHIPS ====================

export const inventoryUnitRelations = relations(inventoryUnits, ({ many, one }) => ({
  item: one(items, {
    fields: [inventoryUnits.itemCode],
    references: [items.itemCode],
  }),
  shelf: one(shelves, {
    fields: [inventoryUnits.shelfCode],
    references: [shelves.code],
  }),
  stockTransactions: many(stockTransactions),
}));
