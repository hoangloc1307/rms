import chalk from 'chalk';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from '~/configs';
import * as schema from './schemas';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

export async function connectDatabase() {
  try {
    await db.execute(sql`SELECT 1`);
    console.log(chalk.green('✅ Database connected successfully.'));
  } catch (error) {
    console.error(chalk.red('❌ Database connection failed'));
    throw error;
  }
}

export async function disconnectDatabase() {
  try {
    await pool.end();
    console.log(chalk.gray('🔌 Database disconnected.'));
  } catch (error) {
    console.error(chalk.red('❌ Database disconnection failed'));
    throw error;
  }
}
