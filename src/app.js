import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { env } from './config/env.js';
import { currentUserMiddleware } from './middleware/auth.js';
import { errorHandler, NotFoundError } from './middleware/errorHandler.js';
import { postRouter } from './routes/postRoutes.js';
import { storyRouter } from './routes/storyRoutes.js';

export const app = express();

// Security & Parsing Middlewares
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Global Auth Context Middleware
app.use(currentUserMiddleware);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: { status: 'healthy', timestamp: new Date().toISOString() },
  });
});

// API Routes
app.use('/api/posts', postRouter);
app.use('/api/stories', storyRouter);

// 404 Catch-All
app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
});

// Global Error Handler Middleware
app.use(errorHandler);
