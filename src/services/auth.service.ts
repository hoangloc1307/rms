import { eq } from 'drizzle-orm';
import { db } from '~/database';
import { users } from '~/database/schemas';
import { AppError } from '~/errors';
import { verifyPassword } from '~/helpers';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '~/utils';

const login = async (username: string, password: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (!user || !user.isActive) {
    throw AppError.unauthorized('Invalid email or password');
  }

  const isPasswordValid = await verifyPassword(password, user.password);

  if (!isPasswordValid) {
    throw AppError.unauthorized('Invalid email or password');
  }

  const accessToken = generateAccessToken({ userId: user.username });
  const refreshToken = generateRefreshToken(user.username);

  return { accessToken, refreshToken };
};

const refresh = async (refreshToken: string) => {
  const decodedToken = verifyRefreshToken(refreshToken);

  if (!decodedToken.userId) {
    throw AppError.unauthorized('Invalid refresh token');
  }

  const user = await db.query.users.findFirst({
    where: eq(users.username, decodedToken.userId),
  });

  if (!user || !user.isActive) {
    throw AppError.unauthorized('Invalid refresh token');
  }

  const accessToken = generateAccessToken({ userId: user.username });

  return { accessToken };
};

export const authService = {
  login,
  refresh,
};
