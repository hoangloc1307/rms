import { pgEnum } from 'drizzle-orm/pg-core';

export const actionEnum = pgEnum('action', ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE', 'APPROVAL']);

export type Action = (typeof actionEnum.enumValues)[number];

export const decisionEnum = pgEnum('decision', ['ALLOW', 'DENY']);

export type Decision = (typeof decisionEnum.enumValues)[number];

export const importStatusEnum = pgEnum('import_status', [
  'PENDING',
  'VALIDATING',
  'VALIDATED',
  'COMMITTED',
  'FAILED',
  'EXPIRED',
]);

export type ImportStatus = (typeof importStatusEnum.enumValues)[number];

export const importActionEnum = pgEnum('import_action', ['CREATE', 'UPDATE', 'SKIP', 'ERROR']);

export type ImportAction = (typeof importActionEnum.enumValues)[number];

export const stockTransactionTypeEnum = pgEnum('stock_transaction_type', ['IN', 'OUT', 'DELIVERED', 'MOVE', 'ADJUST']);

export type StockTransactionType = (typeof stockTransactionTypeEnum.enumValues)[number];

export const inventoryUnitStatusEnum = pgEnum('inventory_unit_status', ['NORMAL', 'EXPIRED', 'ABNORMAL', 'DAMAGED']);

export type InventoryUnitStatus = (typeof inventoryUnitStatusEnum.enumValues)[number];

export const itemTrackingTypeEnum = pgEnum('item_tracking_type', ['LABEL', 'QUANTITY']);

export type ItemTrackingType = (typeof itemTrackingTypeEnum.enumValues)[number];
