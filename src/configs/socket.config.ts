import { ServerOptions } from 'socket.io';

export const socketConfig: Partial<ServerOptions> = {
  path: '/ws',
};
