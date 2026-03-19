export const FILE_EXTENSION = {
  XLSX: {
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    exts: ['.xlsx'],
  },
  XLS: {
    mime: 'application/vnd.ms-excel',
    exts: ['.xls'],
  },
  CSV: {
    mime: 'text/csv',
    exts: ['.csv'],
  },
} as const;

export type FILE_EXTENSION = keyof typeof FILE_EXTENSION;

export const ALLOWED_MIMES: string[] = Object.values(FILE_EXTENSION).map((c) => c.mime);

export const ALLOWED_EXTS: string[] = Object.values(FILE_EXTENSION).flatMap((c) => c.exts);
