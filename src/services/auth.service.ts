import { eq } from 'drizzle-orm';
import { db } from '~/database';
import { users } from '~/database/schemas';
import { AppError } from '~/errors';
import { verifyPassword } from '~/helpers';
import { generateAccessToken, generateRefreshToken } from '~/utils';

const login = async (username: string, password: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
    with: {
      userRoles: true,
    },
  });

  if (!user || !user.isActive) {
    throw AppError.unauthorized('Invalid email or password');
  }

  const isPasswordValid = await verifyPassword(password, user.password);

  if (!isPasswordValid) {
    throw AppError.unauthorized('Invalid email or password');
  }

  const roles = user.userRoles.map((ur) => `${ur.roleCode}:${ur.sectionCode}`);

  const accessToken = generateAccessToken({ userId: user.username, roles });
  const refreshToken = generateRefreshToken(user.username);

  return { accessToken, refreshToken };
};

export const authService = {
  login,
};
