import { format } from 'date-fns';
import fs from 'fs';
import multer, { Options } from 'multer';
import path from 'path';
import { ALLOWED_EXTS, ALLOWED_MIMES } from '~/constants';
import { AppError } from '~/errors';

const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const uploadConfig: (folder: string) => Options = (folder: string) => ({
  storage: multer.diskStorage({
    destination: path.join(uploadDir, folder),
    filename: (req, file, callback) => {
      const safeName = file.originalname.replace(/[^\w.-]+/g, '_');
      callback(null, `${format(new Date(), 'yyyyMMddHHmmss')}-${safeName}`);
    },
  }),
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
});

export const upload = (folder: string) => multer(uploadConfig(folder));
