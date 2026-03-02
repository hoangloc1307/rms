import { prisma } from '~/database/prisma';
import { AppError } from '~/errors';
import { verifyPassword } from '~/helpers';
import { generateAccessToken, generateRefreshToken } from '~/utils';

const login = async (username: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user || !user.isActive) {
    throw AppError.unauthorized('Invalid email or password');
  }

  const isPasswordValid = await verifyPassword(password, user.password);

  if (!isPasswordValid) {
    throw AppError.unauthorized('Invalid email or password');
  }

  const userRoles = await prisma.userRole.findMany({
    where: { username },
  });

  const permissions = userRoles.map((userRole) => `${userRole.roleCode}:${userRole.sectionCode}`);

  const accessToken = generateAccessToken({ userId: user.username, roles: permissions });
  const refreshToken = generateRefreshToken(user.username);

  return { accessToken, refreshToken };
};

export const authService = {
  login,
};
