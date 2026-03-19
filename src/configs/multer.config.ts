import multer, { Options } from 'multer';
import path from 'path';
import { ALLOWED_EXTS, ALLOWED_MIMES } from '~/constants';
import { AppError } from '~/errors';

const uploadConfig: Options = {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 10, // 10MB
    files: 10,
  },
  fileFilter: (req, file, callback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_EXTS.includes(ext) && ALLOWED_MIMES.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(AppError.unsupportedMediaType());
    }
  },
};

export const upload = multer(uploadConfig);
