import { Socket } from 'socket.io';

export const registerTaskHandlers = (socket: Socket) => {
  socket.on('get_task_pending', () => {
    socket.emit('get_task_pending', [
      {
        id: '1',
        documentNo: 'Task 1',
        section: '2120-System',
      },
      {
        id: '2',
        documentNo: 'Task 2',
        section: '2110-Admin',
      },
    ]);
  });
};
