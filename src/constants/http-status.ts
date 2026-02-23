export const HTTP_STATUS = {
  // SUCCESS
  // ✅ Thành công, trả về dữ liệu như mong muốn. VD: GET /users -> trả về danh sách user
  OK: 200,
  // ✅ Tạo mới thành công. VD: POST /users -> tạo user mới
  CREATED: 201,
  // ✅ Không có nội dung trả về. VD: DELETE /users -> xóa user
  NO_CONTENT: 204,

  // CLIENT ERROR
  // ❌ Request không hợp lệ (sai format, thiếu field). VD: thiếu "username" trong body
  BAD_REQUEST: 400,
  // ❌ Chưa đăng nhập hoặc token không hợp lệ. VD: không gửi Authorization header
  UNAUTHORIZED: 401,
  // ❌ Đã đăng nhập nhưng không có quyền. VD: user thường truy cập route admin
  FORBIDDEN: 403,
  // ❌ Không tìm thấy tài nguyên. VD: GET /users/999 -> user không tồn tại
  NOT_FOUND: 404,
  // ❌ Phương thức không hợp lệ. VD: GET /users -> sử dụng phương thức POST
  METHOD_NOT_ALLOWED: 405,
  // ❌ Thời gian yêu cầu quá hạn. VD: GET /users -> thời gian yêu cầu quá hạn
  CONFLICT: 409,
  // ❌ Xung đột dữ liệu. VD: đăng ký với email đã tồn tại
  CONTENT_TOO_LARGE: 413,
  // ❌ Dữ liệu quá lớn. VD: upload file quá lớn
  UNSUPPORTED_MEDIA_TYPE: 415,
  // ❌ Định dạng file không hợp lệ. VD: upload file không phải là ảnh
  LOCKED: 423,
  // ❌ Tài nguyên bị khóa. VD: tài khoản bị khóa
  TOO_MANY_REQUESTS: 429,
  // ❌ Yêu cầu quá nhiều. VD: đăng nhập sai quá nhiều lần

  // SERVER ERROR
  // ❌ Lỗi server
  INTERNAL_SERVER_ERROR: 500,
  // ❌ Chưa được máy chủ hỗ trợ hoặc chưa triển khai
  NOT_IMPLEMENTED: 501,
  // ❌ Lỗi gateway
  BAD_GATEWAY: 502,
  // ❌ Dịch vụ không sẵn sàng, đang bảo trì
  SERVICE_UNAVAILABLE: 503,
  // ❌ Thời gian gateway quá hạn
  GATEWAY_TIMEOUT: 504,
} as const;

export type HttpStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];
