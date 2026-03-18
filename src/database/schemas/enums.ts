import { pgEnum } from 'drizzle-orm/pg-core';

export const actionEnum = pgEnum('action', ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE', 'APPROVAL']);

export type Action = (typeof actionEnum.enumValues)[number];

export const decisionEnum = pgEnum('decision', ['ALLOW', 'DENY']);

export type Decision = (typeof decisionEnum.enumValues)[number];
