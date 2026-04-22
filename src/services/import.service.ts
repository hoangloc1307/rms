import { addMinutes, format } from 'date-fns';
import { db } from '~/database';
import { importJobs } from '~/database/schemas';
import { addImportJob } from '~/helpers';

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

export const importService = {
  importUpload,
};
