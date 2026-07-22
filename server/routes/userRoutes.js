import express from 'express';
import { 
  getUserCreations, 
  toggleLikeCreation 
} from '../controllers/userController.js';

const router = express.Router();

// User Creations Routes
router.get('/creations', getUserCreations);
router.post('/like/:id', toggleLikeCreation);

export default router;
