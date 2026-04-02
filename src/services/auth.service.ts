import { eq } from 'drizzle-orm';
import { OAuth2Client } from 'google-auth-library';
import { env } from '~/configs';
import { db } from '~/database';
import { users } from '~/database/schemas';
import { AppError } from '~/errors';
import { generatePassword, hashPassword, hashResetToken, verifyPassword, verifyResetTokenHash } from '~/helpers';
import { cacheService } from '~/services/cache.service';
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  verifyRefreshToken,
  verifyResetToken,
} from '~/utils';

// ==================== REGISTER ====================

type RegisterParams = { username: string; email: string; name: string };

const register = async ({ username, email, name }: RegisterParams) => {
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (user) {
    throw AppError.conflict('Username already exists');
  }

  const password = generatePassword();

  const hashedPassword = await hashPassword(password);

  const insertValue = await db
    .insert(users)
    .values({
      username,
      password: hashedPassword,
      email,
      name,
      createdBy: 'ADMIN',
    })
    .returning({ username: users.username, email: users.email, name: users.name });

  const createdUser = insertValue[0];

  return {
    username: createdUser.username,
    email: createdUser.email,
    name: createdUser.name,
    password,
  };
};

// ==================== LOGIN ====================

type LoginParams = { username: string; password: string };

const login = async ({ username, password }: LoginParams) => {
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (!user || !user.isActive) {
    throw AppError.unauthorized('Invalid username or password');
  }

  const isPasswordValid = await verifyPassword(password, user.password);

  if (!isPasswordValid) {
    throw AppError.unauthorized('Invalid username or password');
  }

  const accessToken = generateAccessToken({ userId: user.username });
  const refreshToken = generateRefreshToken(user.username);

  return {
    user: { username: user.username, email: user.email, name: user.name },
    token: { accessToken, refreshToken },
  };
};

// ==================== REFRESH TOKEN ====================

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

// ==================== GOOGLE LOGIN ====================

const googleLogin = async (idToken: string) => {
  const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

  const ticket = await client.verifyIdToken({
    idToken,
    audience: env.GOOGLE_CLIENT_ID,
  });

  const payloadData = ticket.getPayload();

  if (!payloadData) {
    throw AppError.unauthorized('Invalid Google token');
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, payloadData.email!),
  });

  // Nếu không có user thì tạo user
  if (!user) {
    const createUser = await db
      .insert(users)
      .values({
        username: '12345678',
        password: '12345678',
        email: payloadData.email,
        name: payloadData.name,
        createdBy: 'SYSTEM',
      })
      .returning({ username: users.username });

    const accessToken = generateAccessToken({ userId: createUser[0].username });
    const refreshToken = generateRefreshToken(createUser[0].username);

    return { accessToken, refreshToken };
  }

  if (!user.isActive) {
    throw AppError.unauthorized('Invalid user');
  }

  const accessToken = generateAccessToken({ userId: user.username });
  const refreshToken = generateRefreshToken(user.username);

  return { accessToken, refreshToken };
};

// ==================== FORGOT PASSWORD ====================

const forgotPassword = async (email: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user || !user.isActive) {
    throw AppError.notFound('No account associated with this email');
  }

  const token = generateResetToken(user.username);

  const hashToken = hashResetToken(token);

  await cacheService.set(`reset_pwd:${user.username}`, hashToken, 5 * 60);

  return {
    token,
    name: user.name,
    email: user.email,
  };
};

// ==================== RESET PASSWORD ====================

type ResetPasswordParams = { token: string; newPassword: string };

const resetPassword = async ({ token, newPassword }: ResetPasswordParams) => {
  let decoded: { userId: string; type: string };

  try {
    decoded = verifyResetToken(token);
  } catch {
    throw AppError.unauthorized('Invalid or expired reset token');
  }

  if (decoded.type !== 'reset') {
    throw AppError.unauthorized('Invalid reset token');
  }

  const storedToken = await cacheService.get(`reset_pwd:${decoded.userId}`);

  if (!storedToken || !verifyResetTokenHash(token, storedToken as string)) {
    throw AppError.unauthorized('Reset token has already been used or expired');
  }

  const user = await db.query.users.findFirst({
    where: eq(users.username, decoded.userId),
  });

  if (!user || !user.isActive) {
    throw AppError.unauthorized('User not found');
  }

  const hashedPassword = await hashPassword(newPassword);

  await db
    .update(users)
    .set({ password: hashedPassword, updatedAt: new Date(), updatedBy: user.username })
    .where(eq(users.username, user.username));

  await cacheService.del(`reset_pwd:${user.username}`);
};

// ==================== CHANGE PASSWORD ====================

type ChangePasswordParams = { userId: string; oldPassword: string; newPassword: string };

const changePassword = async ({ userId, oldPassword, newPassword }: ChangePasswordParams) => {
  const user = await db.query.users.findFirst({
    where: eq(users.username, userId),
  });

  if (!user || !user.isActive) {
    throw AppError.notFound('User not found');
  }

  const isPasswordValid = await verifyPassword(oldPassword, user.password);

  if (!isPasswordValid) {
    throw AppError.badRequest('Invalid old password');
  }

  const hashedPassword = await hashPassword(newPassword);

  await db
    .update(users)
    .set({ password: hashedPassword, updatedAt: new Date(), updatedBy: user.username })
    .where(eq(users.username, user.username));
};

// ==================== EXPORT ====================

export const authService = {
  register,
  login,
  refresh,
  googleLogin,
  forgotPassword,
  resetPassword,
  changePassword,
};
