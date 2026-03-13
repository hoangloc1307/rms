import { Queue } from 'bullmq';
import { redisConfig } from '~/configs';

export const jobQueue = new Queue('jobs', {
  connection: {
    ...redisConfig,
    maxRetriesPerRequest: null,
  },
});
