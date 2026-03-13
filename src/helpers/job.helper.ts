import { jobQueue } from '~/queues';
import { JobDataMap } from '~/workers/worker';

export function addSendMailJob(data: JobDataMap['sendEmail']) {
  return jobQueue.add('sendEmail', data, {
    removeOnComplete: true,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  });
}
