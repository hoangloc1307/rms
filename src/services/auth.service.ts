import { randomUUID } from 'node:crypto';
import { ERROR_CODE, HTTP_STATUS } from '../enums';
import AppError from '../errors/appError';
import userRepository from '../repositories/user.repository';
import { verifyString } from '../utils/bcrypt';
import { signAccessToken, signRefreshToken } from '../utils/jwt';

interface LoginServiceParams {
  username: string;
  password: string;
}

async function login({ username, password }: LoginServiceParams) {
  const user = await userRepository.findUserByUsername(username);

  if (!user)
    throw new AppError(
      ERROR_CODE.UNAUTHORIZED,
      'Tài khoản hoặc mật khẩu không đúng.',
      HTTP_STATUS.UNAUTHORIZED
    );

  const isPasswordOk = await verifyString(password, user.password);

  if (!isPasswordOk)
    throw new AppError(
      ERROR_CODE.UNAUTHORIZED,
      'Tài khoản hoặc mật khẩu không đúng.',
      HTTP_STATUS.UNAUTHORIZED
    );

  const accessToken = signAccessToken({
    username: user.username,
  });

  const jti = randomUUID();
  const refreshToken = signRefreshToken(
    {
      username: user.username,
    },
    jti
  );

  return {
    user: {
      username: user.username,
      name: user.name,
      email: user.email,
    },
    tokens: {
      accessToken,
      refreshToken,
    },
  };
}

const authService = { login };
export default authService;
