import fs from 'fs';
import multer, { Options } from 'multer';
import path from 'path';
import { ALLOWED_EXTS, ALLOWED_MIMES } from '../constants/fileType';
import { ERROR_CODE, HTTP_STATUS } from '../enums';
import AppError from '../errors/appError';
import { envConfig } from './env';

// Kiểm tra thư mục upload file có chưa -> chưa thì tạo
const uploadDir = path.resolve(process.cwd(), envConfig.FILE_UPLOAD_PATH);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set nơi lưu file và sửa tên file bỏ ky tự đặc biệt
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, callback) => {
    const safeName = file.originalname.replace(/[^\w.\-]+/g, '_');
    callback(null, Date.now() + '-' + safeName);
  },
});

export const uploadConfig: Options = {
  storage,
  limits: {
    // fields: 5, // Số lượng field khác không phải file
    fieldSize: 1 * 1024 * 1024, // Kích thước tối đa mỗi field không phải file 1MB
    fieldNameSize: 100, // Chiều dài tối đa tên field 100 bytes
    files: 3, // Số lượng field file tối đa
    fileSize: 5 * 1024 * 1024, // Kích thước tối đa mỗi file 5MB
    headerPairs: 2000, // Số lượng header tối đa cho phép
    parts: 10, // Số lượng field file + field không phải file
  },
  fileFilter: (req, file, callback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_EXTS.includes(ext) && ALLOWED_MIMES.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new AppError(
          ERROR_CODE.UNSUPPORTED_MEDIA_TYPE,
          'Định dạng không được hỗ trợ',
          HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE
        )
      );
    }
  },
};
