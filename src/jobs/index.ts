import chalk from 'chalk';
import { importExpirationJob } from '~/jobs/import-expiration.job';

export const initJobs = async () => {
  await importExpirationJob.start();

  console.log(chalk.green('✅ All background jobs started successfully.'));
};
