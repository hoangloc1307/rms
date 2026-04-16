import { Socket, SocketData } from 'socket.io';
import { AppError } from '~/errors';
import { verifyAccessToken } from '~/utils';

export const authSocketMiddleware = (socket: Socket<never, never, never, SocketData>, next: (err?: Error) => void) => {
  const token = socket.handshake.auth?.token as string;

  if (!token) {
    return next(AppError.unauthorized());
  }

  try {
    const { userId } = verifyAccessToken(token);

    socket.data.userId = userId;

    next();
  } catch {
    next(new Error('Unauthorized'));
  }
};
