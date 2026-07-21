import express from 'express';
import { requireAuth, getAuth } from '@clerk/express';

const router = express.Router();

// Public Health Check Endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Quick AI Server is healthy and running',
    timestamp: new Date().toISOString()
  });
});

// Protected Clerk Auth Verification Endpoint
router.get('/auth', requireAuth(), (req, res) => {
  try {
    const auth = getAuth(req);
    res.status(200).json({
      success: true,
      message: 'Authenticated successfully via Clerk',
      userId: auth.userId,
      claims: auth.sessionClaims
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
});

export default router;
