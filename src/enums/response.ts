export enum HTTP_STATUS {
  OK = 200, // ✅ Thành công, trả về dữ liệu như mong muốn. VD: GET /users -> trả về danh sách user
  CREATED = 201, // ✅ Tạo mới thành công. VD: POST /users -> tạo user mới
  NO_CONTENT = 204, // ✅ Thành công nhưng không có nội dung trả về. VD: DELETE /users/123 -> xóa thành công, không trả dữ liệu
  BAD_REQUEST = 400, // ❌ Request không hợp lệ (sai format, thiếu field). VD: thiếu "username" trong body
  UNAUTHORIZED = 401, // ❌ Chưa đăng nhập hoặc token không hợp lệ. VD: không gửi Authorization header
  FORBIDDEN = 403, // ❌ Đã đăng nhập nhưng không có quyền. VD: user thường truy cập route admin
  NOT_FOUND = 404, // ❌ Không tìm thấy tài nguyên. VD: GET /users/999 -> user không tồn tại
  CONFLICT = 409, // ❌ Xung đột dữ liệu. VD: đăng ký với email đã tồn tại
  CONTENT_TOO_LARGE = 413, // ❌ Payload quá lớn. VD: upload file > 5MB trong khi server giới hạn 5MB
  UNSUPPORTED_MEDIA_TYPE = 415, // ❌ Định dạng dữ liệu/file không được hỗ trợ. VD: upload file .exe khi chỉ cho phép .jpg/.pdf
  LOCKED = 423, // ❌ Tài khoản/Tài nguyên bị khóa. VD: vượt quá số lần đăng nhập sai → khóa đến lockedUntil
  TOO_MANY_REQUESTS = 429, // ❌ Gửi quá nhiều request trong thời gian ngắn. VD: spam login
  INTERNAL_SERVER_ERROR = 500, // ❌ Lỗi phía server. VD: lỗi kết nối DB, throw exception không xử lý
  SERVICE_UNAVAILABLE = 503, // ❌ Server tạm thời không khả dụng. VD: quá tải, bảo trì hệ thống
}

export enum ERROR_CODE {
  PAYLOAD_ERROR = 'PAYLOAD_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  INVALID_USERNAME = 'INVALID_USERNAME',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  CORS_ERROR = 'CORS_ERROR',
  UNSUPPORTED_MEDIA_TYPE = 'UNSUPPORTED_MEDIA_TYPE',
  LIMIT_FILE_SIZE = 'LIMIT_FILE_SIZE',
  UPLOAD_ERROR = 'UPLOAD_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  CONFLICT = 'CONFLICT',
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
  LOCKED = 'LOCKED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
}
