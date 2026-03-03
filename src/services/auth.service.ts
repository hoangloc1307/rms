import { prisma } from '~/database/prisma';
import { AppError } from '~/errors';
import { verifyPassword } from '~/helpers';
import { generateAccessToken, generateRefreshToken } from '~/utils';

const login = async (username: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      userRole: {
        select: {
          roleCode: true,
          sectionCode: true,
        },
        where: {
          role: {
            isActive: true,
          },
        },
      },
    },
  });

  if (!user || !user.isActive) {
    throw AppError.unauthorized('Invalid email or password');
  }

  const isPasswordValid = await verifyPassword(password, user.password);

  if (!isPasswordValid) {
    throw AppError.unauthorized('Invalid email or password');
  }

  const roles = user.userRole.map((role) => `${role.roleCode}:${role.sectionCode}`);

  const accessToken = generateAccessToken({ userId: user.username, roles });
  const refreshToken = generateRefreshToken(user.username);

  return { accessToken, refreshToken };
};

export const authService = {
  login,
};
