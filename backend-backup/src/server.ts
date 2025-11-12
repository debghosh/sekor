import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.routes';
import articlesRoutes from './routes/articles.routes';
import authorsRoutes from './routes/authors.routes';
import followsRouter from './routes/follows';
//import userInteractionsRoutes from './routes/userInteractions.routes';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.get('/api/v1', (req, res) => {
  res.json({ 
    message: 'SEKOR-BKC API v1.0',
    endpoints: {
      auth: '/api/v1/auth',
      articles: '/api/v1/articles',
      authors: '/api/v1/authors',
    }
  });
});

// Auth routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/auth', authRoutes); 

// Articles routes
app.use('/api/v1/articles', articlesRoutes);

// Authors routes
app.use('/api/v1/authors', authorsRoutes);

app.use('/api/v1/follows', followsRouter);

//app.use('/api/follows', followsRouter);

// User interactions routes
//app.use('/api/v1/interactions', userInteractionsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    error: err.message || 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/v1/auth`);
  console.log(`📰 Articles API: http://localhost:${PORT}/api/v1/articles`);
});

// Graceful shutdown
const shutdown = async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
