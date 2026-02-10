import jwt, { JwtPayload } from 'jsonwebtoken';
import { envConfig } from '../config';

export function signAccessToken(payload: object) {
  return jwt.sign(payload, envConfig.JWT_ACCESS_SECRET, {
    expiresIn: envConfig.JWT_ACCESS_EXPIRES,
  });
}

export function signRefreshToken(payload: object, jti?: string) {
  return jwt.sign(payload, envConfig.JWT_REFRESH_SECRET, {
    expiresIn: envConfig.JWT_REFRESH_EXPIRES,
    jwtid: jti,
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, envConfig.JWT_ACCESS_SECRET) as JwtPayload;
  } catch (err) {
    throw err;
  }
}

export function verifyRefreshToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, envConfig.JWT_REFRESH_SECRET) as JwtPayload;
  } catch (err) {
    throw err;
  }
}
