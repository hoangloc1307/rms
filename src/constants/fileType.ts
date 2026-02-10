export const FILE_EXTENSION = {
  JPG: {
    mime: 'image/jpeg',
    exts: ['.jpg', '.jpeg'],
  },
  PNG: {
    mime: 'image/png',
    exts: ['.png'],
  },
  PDF: {
    mime: 'application/pdf',
    exts: ['.pdf'],
  },
  XLSX: {
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    exts: ['.xlsx'],
  },
  XLS: {
    mime: 'application/vnd.ms-excel',
    exts: ['.xls'],
  },
  DOCX: {
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    exts: ['.docx'],
  },
} as const;

export type FILE_EXTENSION = keyof typeof FILE_EXTENSION;

export const ALLOWED_MIMES: string[] = Object.values(FILE_EXTENSION).map(
  (c) => c.mime
);

export const ALLOWED_EXTS: string[] = Object.values(FILE_EXTENSION).flatMap(
  (c) => c.exts
);
