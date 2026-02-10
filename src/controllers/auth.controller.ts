import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { envConfig } from '../config';
import { ENVIROMENTS } from '../enums';
import { sendSuccess } from '../utils/response';

//  [POST] /auth/login
const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const result = await authService.login({ username, password });

  res.cookie('rt', result.tokens.refreshToken, {
    httpOnly: true, // Chỉ gửi qua HTTP(S) request và không thể truy cập từ JavaScript
    secure: envConfig.ENV === ENVIROMENTS.PRODUCTION, // Chỉ gửi qua HTTPS khi production
    sameSite: 'lax',
    path: '/api/auth/refresh', // Chỉ gửi cookie khi refresh token
    maxAge: envConfig.JWT_REFRESH_EXPIRES * 1000, // ms
  });

  const { tokens, ...rest } = result;
  sendSuccess(res, { ...rest, accessTokent: result.tokens.accessToken });
};

const authController = { login };
export default authController;
