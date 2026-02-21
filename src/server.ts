import chalk from 'chalk';
// import { envConfig } from './config';
// import { prisma } from './lib/prisma';
import http from 'http';
import app from '~/app';
import { environmentConfig } from '~/configs';

const server = http.createServer(app);

function startServer() {
  try {
    // await prisma.$connect();
    // console.log(chalk.green('✅ Prisma đã kết nối database thành công!'));

    // server.listen(envConfig.PORT, () => {
    //   console.log(
    //     chalk.blue(
    //       `🚀 Server ${envConfig.ENV} running at ${envConfig.BASE_URL}:${envConfig.PORT}`
    //     ),
    //     chalk.yellow(
    //       `🚀 Swagger running at ${envConfig.BASE_URL}:${envConfig.PORT}/api-docs`
    //     )
    //   );
    // });
    server.listen(3000, () => {
      console.log(chalk.blue(`🚀 Server (${environmentConfig.ENVIRONMENT}) running at http://localhost:3000`));
    });
  } catch (error) {
    // console.error(chalk.red('❌ Không thể kết nối database:', error));
    console.log(error);
    process.exit(1);
  }
}

startServer();
