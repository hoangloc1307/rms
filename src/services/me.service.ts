import { eq } from 'drizzle-orm';
import { db } from '~/database';
import { users } from '~/database/schemas';
import { AppError } from '~/errors';

// ==================== GET ME ====================

const getMe = async (userId: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.username, userId),
    columns: {
      username: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    throw AppError.notFound('User not found');
  }

  return user;
};

// ==================== EXPORT ====================

export const meService = {
  getMe,
};
