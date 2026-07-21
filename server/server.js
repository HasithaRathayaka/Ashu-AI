import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express';
import connectDB from './config/db.js';
import testRoutes from './routes/testRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Load Environment Variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB();

// Core Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Clerk Authentication Middleware
app.use(clerkMiddleware());

// API Routes
app.use('/api/test', testRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/user', userRoutes);

// Root Health Route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    app: 'Quick AI Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/test/health',
      aiTools: '/api/ai/*',
      userCreations: '/api/user/creations',
      communityFeed: '/api/user/community'
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Quick AI Server listening on port ${PORT} (http://localhost:${PORT})`);
});
