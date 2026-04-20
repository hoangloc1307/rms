import { QueueEvents } from 'bullmq';
import { Server } from 'socket.io';
import { redisConfig } from '~/configs';

export const initQueueEvents = (socket: Server) => {
  const queueEvents = new QueueEvents('jobs', {
    connection: redisConfig,
  });

  queueEvents.on('completed', ({ returnvalue }) => {
    if (!returnvalue) return;

    const data = returnvalue as unknown as {
      token: string;
      userId: string;
      type: string;
    };

    if (data.type === 'import') {
      socket.emit('import_validated', { token: data.token });
    }
  });

  queueEvents.on('failed', ({ jobId, failedReason }) => {
    console.error('Job failed:', jobId, failedReason);
  });
};
