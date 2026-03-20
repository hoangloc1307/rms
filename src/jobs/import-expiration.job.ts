import { and, eq, lte, ne } from 'drizzle-orm';
import fs from 'fs/promises';
import cron from 'node-cron';
import { db } from '~/database';
import { importJobRows, importJobs } from '~/database/schemas';
import { logger } from '~/utils';

const CRON_EXPRESSION = '0 0 0 * * *';

const cleanupExpiredImportJobs = async () => {
  const now = new Date();

  const expiredJobs = await db.query.importJobs.findMany({
    where: and(lte(importJobs.expiredAt, now), ne(importJobs.status, 'EXPIRED'), ne(importJobs.status, 'COMMITTED')),
  });

  if (!expiredJobs.length) {
    return;
  }

  for (const job of expiredJobs) {
    try {
      await fs.rm(job.fileUrl, { force: true });

      await db.transaction(async (tx) => {
        await tx.delete(importJobRows).where(eq(importJobRows.jobId, job.id));

        await tx
          .update(importJobs)
          .set({
            status: 'EXPIRED',
          })
          .where(eq(importJobs.id, job.id));
      });

      logger.info({ token: job.token, fileUrl: job.fileUrl }, 'Expired import job cleaned up successfully');
    } catch (error) {
      logger.error(
        {
          token: job.token,
          fileUrl: job.fileUrl,
          error,
        },
        'Failed to clean expired import job',
      );
    }
  }
};

export const importExpirationJob = cron.schedule(
  CRON_EXPRESSION,
  () => {
    void cleanupExpiredImportJobs();
  },
  {
    timezone: 'Asia/Ho_Chi_Minh',
  },
);
