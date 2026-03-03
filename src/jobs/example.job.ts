import cron from 'node-cron';

export const exampleJob = cron.schedule(
  '0 0 0 * * *',
  () => {
    console.log('Running job at 00:00:00...');
  },
  {
    timezone: 'Asia/Ho_Chi_Minh',
  },
);
