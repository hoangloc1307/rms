import { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { ERROR_CODE, HTTP_STATUS } from '../enums';
import AppError from '../errors/appError';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Thời gian tính số lượng request: 15 phút
  max: 5, // Số lượng request cho phép trong khoảng thời gian windowMs
  handler: (req: Request, res: Response, next: NextFunction) =>
    next(
      new AppError(
        ERROR_CODE.TOO_MANY_REQUESTS,
        'Yêu cầu quá nhiều, thử lại sau.',
        HTTP_STATUS.TOO_MANY_REQUESTS
      )
    ), // Hàm xử lý khi vượt quá số lượng request
  standardHeaders: true, // Gửi thông tin giới hạn qua header chuẩn
  legacyHeaders: false, // Không gửi header X-RateLimit-* kiểu cũ (legacy)
});
