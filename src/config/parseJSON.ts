import { OptionsJson } from 'body-parser';

export const jsonConfig: OptionsJson = {
  inflate: false, // Cho phép hay không xử lý body bị nén (gzip/deflate)
  limit: '100kb', // Giới hạn dung lượng tối đa của request body
  strict: true, // Kiểm soát loại dữ liệu JSON được chấp nhận
  type: ['application/json'], // Xác định media type nào sẽ được parser xử lý
};
