import chalk from 'chalk';
import { exampleJob } from '~/jobs/example.job';

export const initJobs = async () => {
  await exampleJob.start();

  console.log(chalk.green('✅ All background jobs started successfully.'));
};
