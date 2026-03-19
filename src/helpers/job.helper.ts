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

export function addImportJob(data: JobDataMap['import']) {
  return jobQueue.add('import', data, {
    removeOnComplete: true,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  });
}
