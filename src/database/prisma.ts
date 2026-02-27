import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '~/configs';
import { PrismaClient } from '../../generated/prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (env.ENVIRONMENT !== 'production') {
  globalForPrisma.prisma = prisma;
}
