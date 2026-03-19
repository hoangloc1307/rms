import { Request } from 'express';
import { FILE_EXTENSION } from '~/constants';

export const generateFileKey = (filename: string) => {
  const timestamp = Date.now();
  return `uploads/${timestamp}-${filename}`;
};

export const getFilesFromReq = (req: Request, field: string) => {
  if (req.file && req.file.fieldname === field) return [req.file];

  const f = req.files;
  if (!f) return [];

  if (Array.isArray(f)) return f.filter((x) => x.fieldname === field);

  if (f[field]) return f[field];

  return [];
};

export const resolveAllowed = (
  allow: FILE_EXTENSION[],
): {
  mimes: Set<string>;
  exts: Set<string>;
} => {
  const mimes = new Set<string>();
  const exts = new Set<string>();

  if (allow?.length) {
    for (const type of allow) {
      const fileType = FILE_EXTENSION[type];
      if (fileType) {
        mimes.add(fileType.mime);
        fileType.exts.forEach((x) => exts.add(x));
      }
    }
  }

  return { mimes, exts };
};
