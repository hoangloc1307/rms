import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env, s3 } from '~/configs';
import { generateFileKey } from '~/utils';

const generateUploadUrl = async (filename: string, contentType: string) => {
  const key = generateFileKey(filename);

  const command = new PutObjectCommand({
    Bucket: env.AWS_S3_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3, command, {
    expiresIn: 60,
  });

  const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return { uploadUrl, fileUrl };
};

export const uploadService = {
  generateUploadUrl,
};
