import { Router } from 'express';
import { getUploadUrl, getDownloadUrl } from '../controllers/file.controller.js';
import verifyToken from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/upload-url', verifyToken, getUploadUrl);
router.get('/download-url/:filename', verifyToken, getDownloadUrl);

export default router;
