import { Job, Worker } from 'bullmq';
import chalk from 'chalk';
import { redisConfig } from '~/configs';
import { emailProcessor, importProcessor } from '~/processors';
import { SendMailProps } from '~/services';
import { logger } from '~/utils';

export type JobDataMap = {
  sendEmail: SendMailProps;
  import: { token: string; type: string };
};

const processors: { [K in keyof JobDataMap]: (job: Job<JobDataMap[K]>) => Promise<unknown> } = {
  sendEmail: emailProcessor,
  import: importProcessor,
};

const worker = new Worker(
  'jobs',
  async (job: Job) => {
    const processor = processors[job.name as keyof JobDataMap] as (job: Job) => Promise<unknown>;
    return processor(job);
  },
  {
    connection: {
      ...redisConfig,
      maxRetriesPerRequest: null,
    },
    concurrency: 5,
  },
);

worker.on('ready', () => {
  console.log(chalk.green('✅ Worker is ready'));
});

worker.on('failed', (job, err) => {
  logger.error({
    jobId: job?.id,
    jobName: job?.name,
    data: job?.data,
    error: err,
  });
});
