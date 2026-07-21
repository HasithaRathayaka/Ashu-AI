import express from 'express';
import { 
  getUserCreations, 
  getCommunityCreations, 
  toggleLikeCreation 
} from '../controllers/userController.js';

const router = express.Router();

// User Creations & Community Routes
router.get('/creations', getUserCreations);
router.get('/community', getCommunityCreations);
router.post('/like/:id', toggleLikeCreation);

export default router;
