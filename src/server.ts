import chalk from 'chalk';
import http from 'http';
import { Server, Socket, SocketData } from 'socket.io';
import app from '~/app';
import { env, socketConfig } from '~/configs';
import { connectDatabase, disconnectDatabase } from '~/database';
import { initJobs } from '~/jobs';
import { authSocketMiddleware } from '~/middlewares/auth-socket.middleware';
import { mailService } from '~/services';
import { registerSocketHandlers } from '~/socket';
import { initQueueEvents } from '~/socket/queue-events';

const server = http.createServer(app);
const io = new Server(server, socketConfig);

async function startServer() {
  try {
    // Connect db
    await connectDatabase();

    io.use(authSocketMiddleware);

    initQueueEvents(io);

    io.on('connection', (socket: Socket<never, never, never, SocketData>) => {
      const userId = socket.data.userId;

      if (!userId) return;

      registerSocketHandlers(socket);
    });

    // Server start
    server.listen(env.PORT, env.BASE_URL, () => {
      console.log(chalk.green(`✅ Server ${env.ENVIRONMENT} running at ${env.BASE_URL}:${env.PORT}`));
    });

    // Start jobs
    await initJobs();

    // Init mailer
    await mailService.verifyConnection();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

function gracefulShutdown(signal: string) {
  console.log(chalk.yellow(`🛑 Received ${signal}. Shutting down gracefully...`));

  // Buộc shutdown sau 10s nếu không graceful shutdown được.
  const forceShutdown = setTimeout(() => {
    console.error('⏰ Force shutdown after 10s');
    process.exit(1);
  }, 10000);

  // Không giữ event loop — nếu shutdown xong sớm thì cho process thoát ngay
  forceShutdown.unref();

  // Ngừng nhận request mới
  server.close(() => {
    console.log(chalk.gray('📦 HTTP server closed!'));

    void (async () => {
      try {
        // Ngắt kết nối db
        await disconnectDatabase();

        // Xoá timmer khi shutdown thành công
        clearTimeout(forceShutdown);

        process.exit(0);
      } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
      }
    })();
  });
}

process.on('SIGINT', () => {
  gracefulShutdown('SIGINT');
});
process.on('SIGTERM', () => {
  gracefulShutdown('SIGTERM');
});

void startServer();
