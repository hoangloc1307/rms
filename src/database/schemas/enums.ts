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
