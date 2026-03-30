import { relations } from 'drizzle-orm';
import { boolean, char, decimal, pgTable, primaryKey, timestamp, varchar } from 'drizzle-orm/pg-core';
import { items } from '~/database/schemas/items.schema';
import { shelves } from '~/database/schemas/shelves.schema';
import { stockTransactions } from '~/database/schemas/stock-transaction.schema';

// ==================== TABLE DEFINITIONS ====================

export const shelfInventory = pgTable(
  'shelf_inventory',
  {
    shelfCode: varchar('shelf_code', { length: 20 })
      .notNull()
      .references(() => shelves.code),
    itemCode: varchar('item_code', { length: 10 })
      .notNull()
      .references(() => items.itemCode),
    quantity: decimal('quantity', { precision: 18, scale: 3 }).notNull(),
    note: varchar('note', { length: 255 }),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, precision: 0 }).defaultNow().notNull(),
    createdBy: char('created_by', { length: 8 }).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, precision: 0 }),
    updatedBy: char('updated_by', { length: 8 }),
  },
  (table) => [
    primaryKey({
      columns: [table.shelfCode, table.itemCode],
    }),
  ],
);

// ==================== RELATIONSHIPS ====================

export const shelfInventoryRelations = relations(shelfInventory, ({ many, one }) => ({
  item: one(items, {
    fields: [shelfInventory.itemCode],
    references: [items.itemCode],
  }),
  shelf: one(shelves, {
    fields: [shelfInventory.shelfCode],
    references: [shelves.code],
  }),
  stockTransactions: many(stockTransactions),
}));
