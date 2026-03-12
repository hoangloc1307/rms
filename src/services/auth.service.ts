import { eq } from 'drizzle-orm';
import { OAuth2Client } from 'google-auth-library';
import { env } from '~/configs';
import { db } from '~/database';
import { users } from '~/database/schemas';
import { AppError } from '~/errors';
import { generatePassword, hashPassword, verifyPassword } from '~/helpers';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '~/utils';
import { LoginSchema, RegisterSchema } from '~/validations';

const register = async (payload: RegisterSchema) => {
  const user = await db.query.users.findFirst({
    where: eq(users.username, payload.username),
  });

  if (user) {
    throw AppError.conflict('Username already exists');
  }

  const password = generatePassword();

  const hashedPassword = await hashPassword(password);

  const insertValue = await db
    .insert(users)
    .values({
      username: payload.username,
      password: hashedPassword,
      email: payload.email,
      name: payload.name,
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

const login = async (payload: LoginSchema) => {
  const user = await db.query.users.findFirst({
    where: eq(users.username, payload.username),
  });

  if (!user || !user.isActive) {
    throw AppError.unauthorized('Invalid email or password');
  }

  const isPasswordValid = await verifyPassword(payload.password, user.password);

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

const googleLogin = async (idToken: string) => {
  const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

  const ticket = await client.verifyIdToken({
    idToken,
    audience: env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw AppError.unauthorized('Invalid Google token');
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, payload.email!),
  });

  // Nếu không có user thì tạo user
  if (!user) {
    const createUser = await db
      .insert(users)
      .values({
        username: '12345678',
        password: '12345678',
        email: payload.email,
        name: payload.name,
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

export const authService = {
  register,
  login,
  refresh,
  googleLogin,
};
