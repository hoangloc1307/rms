import { CorsOptions } from 'cors';

const whiteList = new Set(['http://localhost:5000', 'http://127.0.0.1:5000']);

export const corsConfig: CorsOptions = {
  // origin: (origin: string | undefined, callback: Function) => {
  //   if (!origin || whiteList.has(origin)) {
  //     callback(null, true);
  //   } else {
  //     // callback(
  //     //   new AppError(ERROR_CODE.CORS_ERROR, 'Origin not allowed by CORS policy')
  //     // );
  //   }
  // },
  // methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Các HTTP method được phép trong CORS preflight (OPTIONS)
  // allowedHeaders: ['Content-Type', 'Authorization'], // Các request headers mà client được phép gửi lên server
  // exposedHeaders: ['RateLimit-Limit', 'RateLimit-Remaining'], // Các request headers mà client được phép gửi lên server
  // credentials: true, // Cho phép gửi kèm thông tin xác thực (cookie, Authorization header)
  // maxAge: 10 * 60, // Thời gian (giây) cache kết quả preflight
  // // optionsSuccessStatus: HTTP_STATUS.NO_CONTENT, // HTTP status trả về khi preflight thành công
};
