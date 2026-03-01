import chalk from 'chalk';
import http from 'http';
import app from '~/app';
import { env } from '~/configs';
import { prisma } from '~/database/prisma';

const server = http.createServer(app);

async function startServer() {
  try {
    // Connect db
    await prisma.$connect();
    console.log(chalk.green('✅ Prisma đã kết nối database thành công!'));

    // Server start
    server.listen(env.PORT, () => {
      console.log(chalk.blue(`🚀 Server ${env.ENVIRONMENT} running at ${env.BASE_URL}:${env.PORT}`));
    });
  } catch (error) {
    console.error(chalk.red('❌ Không thể kết nối database:', error));
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
        await prisma.$disconnect();
        console.log(chalk.gray('🔌 Prisma disconnected!'));

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
