import { relations } from 'drizzle-orm';
import { AnyPgColumn, boolean, char, integer, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { features } from '~/database/schemas/features.schema';

// ==================== TABLE DEFINITIONS ====================

export const menus = pgTable('menus', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 150 }).notNull(),
  path: varchar('path', { length: 255 }).notNull(),
  icon: varchar('icon', { length: 255 }).notNull(),
  parentId: integer('parent_id').references((): AnyPgColumn => menus.id),
  order: integer('order').notNull().default(0),
  featureCode: varchar('feature_code', { length: 255 })
    .notNull()
    .references(() => features.code),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 0 }).defaultNow().notNull(),
  createdBy: char('created_by', { length: 8 }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, precision: 0 }),
  updatedBy: char('updated_by', { length: 8 }),
});

// ==================== RELATIONSHIPS ====================

export const menusRelations = relations(menus, ({ one, many }) => ({
  feature: one(features, {
    fields: [menus.featureCode],
    references: [features.code],
  }),
  parent: one(menus, {
    fields: [menus.parentId],
    references: [menus.id],
  }),
  children: many(menus),
}));
