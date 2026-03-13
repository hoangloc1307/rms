import { Job, Worker } from 'bullmq';
import { redisConfig } from '~/configs';
import { emailProcessor } from '~/processors';
import { SendMailProps } from '~/services';

export type JobDataMap = {
  sendEmail: SendMailProps;
};

const processors: { [K in keyof JobDataMap]: (job: Job<JobDataMap[K]>) => Promise<unknown> } = {
  sendEmail: emailProcessor,
};

new Worker(
  'jobs',
  async (job: Job) => {
    const processor = processors[job.name as keyof JobDataMap];
    return processor(job as Job<JobDataMap[keyof JobDataMap]>);
  },
  {
    connection: {
      ...redisConfig,
      maxRetriesPerRequest: null,
    },
    concurrency: 5,
  },
);
