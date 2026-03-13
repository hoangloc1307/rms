import { jobQueue } from '~/queues';
import { JobDataMap } from '~/workers/worker';

export function addJob<K extends keyof JobDataMap>(name: K, data: JobDataMap[K]) {
  return jobQueue.add(name, data);
}
