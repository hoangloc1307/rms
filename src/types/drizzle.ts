import { db } from '~/database';

export type PgTx = Parameters<Parameters<typeof db.transaction>[0]>[0];
