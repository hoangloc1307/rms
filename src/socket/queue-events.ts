import { QueueEvents } from 'bullmq';
import { Server } from 'socket.io';
import { redisConfig } from '~/configs';
import { notificationService } from '~/services';

export const initQueueEvents = (io: Server) => {
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
      void (async () => {
        await notificationService.createNotification({
          userId: data.userId,
          type: 'IMPORT',
          entityType: 'IMPORT',
          entityId: data.token,
          title: 'New Import',
          content: 'Your import file has been validated and is ready to be committed.',
        });
      })();

      io.to(`user:${data.userId}`).emit('notification:new');
    }
  });

  queueEvents.on('failed', ({ jobId, failedReason }) => {
    console.error('Job failed:', jobId, failedReason);
  });
};
