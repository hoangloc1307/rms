import { Socket } from 'socket.io';
import { registerTaskHandlers } from '~/socket/handlers/task.handler';

export const registerSocketHandlers = (socket: Socket) => {
  registerTaskHandlers(socket);
};
