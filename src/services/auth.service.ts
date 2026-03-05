import { eq } from 'drizzle-orm';
import { db } from '~/database';
import { users } from '~/database/schemas';
import { AppError } from '~/errors';
import { verifyPassword } from '~/helpers';
import { generateAccessToken, generateRefreshToken } from '~/utils';

const login = async (username: string, password: string) => {
  const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);

  if (!user || !user.isActive) {
    throw AppError.unauthorized('Invalid email or password');
  }

  const isPasswordValid = await verifyPassword(password, user.password);

  if (!isPasswordValid) {
    throw AppError.unauthorized('Invalid email or password');
  }

  const accessToken = generateAccessToken({ userId: user.username, roles: ['ADMIN'] });
  const refreshToken = generateRefreshToken(user.username);

  return { accessToken, refreshToken };
};

export const authService = {
  login,
};
