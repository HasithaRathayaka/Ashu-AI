import express from 'express';
import multer from 'multer';
import { 
  generateArticle, 
  generateBlogTitles, 
  generateImage, 
  removeBackground, 
  removeObject 
} from '../controllers/aiController.js';

const router = express.Router();

// Memory storage configuration for Multer file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// AI Generation Routes
router.post('/article', generateArticle);
router.post('/titles', generateBlogTitles);
router.post('/image', generateImage);
router.post('/remove-bg', upload.single('image'), removeBackground);
router.post('/remove-object', upload.single('image'), removeObject);

export default router;
