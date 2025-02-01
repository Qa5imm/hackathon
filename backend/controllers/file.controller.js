import s3Client from '../config/file.config.js';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

export const getUploadUrl = async (req, res) => {
  try {
    const { filename } = req.query;
    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: filename
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    res.json({ url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDownloadUrl = async (req, res) => {
  try {
    const { filename } = req.params;
    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: filename
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    res.json({ url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
