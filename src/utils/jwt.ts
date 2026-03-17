import jwt from 'jsonwebtoken';
import { env } from '~/configs';

export function generateAccessToken(payload: { userId: string }) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_TOKEN_EXPIRY,
  });
}

export function generateRefreshToken(userId: string) {
  return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_TOKEN_EXPIRY,
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as { userId: string };
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string };
}

export function generateResetToken(username: string) {
  return jwt.sign({ userId: username, type: 'reset' }, env.JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });
}

export function verifyResetToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as { userId: string; type: string };
}
