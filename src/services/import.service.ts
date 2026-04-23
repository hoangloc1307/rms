import { addMinutes, format } from 'date-fns';
import { and, asc, eq, gte } from 'drizzle-orm';
import { db } from '~/database';
import { importJobRows, importJobs } from '~/database/schemas';
import { AppError } from '~/errors';
import { addImportJob } from '~/helpers';

// ==================== UPLOAD IMPORT ====================

type ImportUploadParams = {
  file: Express.Multer.File;
  type: string;
  createdBy: string;
};

const importUpload = async (params: ImportUploadParams) => {
  const { file, type, createdBy } = params;
  const time = new Date();

  const token = `import-${format(time, 'yyyyMMddHHmmss')}`;
  const expiredAt = addMinutes(time, 10);

  const insertedData = await db
    .insert(importJobs)
    .values({
      token,
      type,
      status: 'PENDING',
      createdBy,
      totalRows: 0,
      createdRows: 0,
      updatedRows: 0,
      skippedRows: 0,
      errorRows: 0,
      expiredAt,
      fileName: file.originalname,
      fileUrl: file.path,
    })
    .returning();

  await addImportJob({ token: insertedData[0].token, type: insertedData[0].type });

  return {
    token: insertedData[0].token,
    status: insertedData[0].status,
    expiredAt: insertedData[0].expiredAt,
  };
};

// ==================== GET IMPORT BY CODE ====================

const getImportByCode = async (token: string) => {
  const result = await db.query.importJobs.findFirst({
    where: and(eq(importJobs.token, token), gte(importJobs.expiredAt, new Date()), eq(importJobs.status, 'VALIDATED')),
    with: {
      importJobRows: {
        columns: {
          jobId: false,
          rawData: false,
          rowKey: false,
        },
        orderBy: asc(importJobRows.rowNumber),
      },
    },
    columns: {
      fileUrl: false,
    },
  });

  if (!result) {
    throw AppError.notFound('Import not found or expired');
  }

  return result;
};

// ==================== EXPORT ====================

export const importService = {
  importUpload,
  getImportByCode,
};
