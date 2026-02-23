import { CorsOptions } from 'cors';

const allowedOrigins = [/^http:\/\/localhost:\d+$/];

export const corsConfig: CorsOptions = {
  // Cấu hình Access-Control-Allow-Origin CORS header
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some((allowed) =>
      allowed instanceof RegExp ? allowed.test(origin) : allowed === origin,
    );

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },

  // Cấu hình Access-Control-Allow-Methods CORS header
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],

  // Cấu hình Access-Control-Allow-Headers CORS header, là các headers mà client được phép gửi lên server
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],

  // Cấu hình Access-Control-Expose-Headers CORS header, là các headers mà client được phép đọc từ response
  exposedHeaders: ['X-Request-Id'],

  // Cấu hình Access-Control-Allow-Credentials CORS header, cho phép gửi kèm thông tin xác thực (cookie, Authorization header)
  credentials: true,

  // Cấu hình Access-Control-Max-Age CORS header, thời gian (giây) cache kết quả preflight
  maxAge: 300,

  // Cấu hình preflightContinue, nếu là true thì preflight sẽ không trả về response mà sẽ tiếp tục xử lý request
  preflightContinue: false,

  // HTTP status code mà server sẽ trả về cho request OPTIONS (preflight) khi thành công.
  optionsSuccessStatus: 204,
};
