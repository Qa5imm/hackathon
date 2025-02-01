import {storageClient} from "@/lib/auth/storage"; 
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";


export const getUploadUrl = async (
  key: string,
  expiresIn: number = 3600
): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(storageClient, command, { expiresIn });
};

export const getDownloadUrl = async (
  key: string,
  expiresIn: number = 3600
): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(storageClient, command, { expiresIn });
};

export const generateStorageKey = (
  userId: string,
  fileName: string
): string => {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${userId}/${timestamp}-${sanitizedFileName}`;
};