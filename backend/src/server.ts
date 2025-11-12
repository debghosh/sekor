import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import { requestIdMiddleware } from './middleware/requestId';
import { deprecationMiddleware } from './middleware/deprecation';
import authRoutes from './routes/auth.routes';
import articlesRoutes from './routes/articles.routes';
import authorsRoutes from './routes/authors.routes';
import followsRoutes from './routes/follows.routes';
import { ResponseHandler } from './utils/response';

//const app = express();

const app:Express = express();

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Security & CORS
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request ID middleware (must be first)
app.use(requestIdMiddleware);

// Deprecation/redirect handling
app.use(deprecationMiddleware);

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${req.id}] ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API root endpoint
app.get('/api/v1', (req: Request, res: Response) => {
  ResponseHandler.success(res, {
    name: 'SEKOR-BKC API',
    version: '1.0.0',
    description: 'শেকড় - The Kolkata Chronicle API',
    endpoints: {
      auth: '/api/v1/auth',
      articles: '/api/v1/articles',
      authors: '/api/v1/authors',
      follows: '/api/v1/follows',
    },
    documentation: '/api/v1/docs'
  });
});

// API Routes - v1
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/articles', articlesRoutes);
app.use('/api/v1/authors', authorsRoutes);
app.use('/api/v1/follows', followsRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  ResponseHandler.notFound(res, 'Endpoint', req.id);
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`[${req.id}] Error:`, err);
  
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  ResponseHandler.error(
    res,
    statusCode,
    err.code || 'INTERNAL_SERVER_ERROR',
    message,
    err.details,
    req.id
  );
});

// Start server
const server = app.listen(PORT, () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚀 SEKOR-BKC Backend Server');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📡 Server:      http://localhost:${PORT}`);
  console.log(`💚 Health:      http://localhost:${PORT}/health`);
  console.log(`📚 API Root:    http://localhost:${PORT}/api/v1`);
  console.log(`🔐 Auth:        http://localhost:${PORT}/api/v1/auth`);
  console.log(`📰 Articles:    http://localhost:${PORT}/api/v1/articles`);
  console.log(`👥 Authors:     http://localhost:${PORT}/api/v1/authors`);
  console.log(`🔖 Follows:     http://localhost:${PORT}/api/v1/follows`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

// Graceful shutdown
const shutdown = async () => {
  console.log('\n🛑 Shutting down gracefully...');
  server.close(async () => {
    await prisma.$disconnect();
    console.log('✅ Server shut down complete');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('⚠️  Forcing shutdown...');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export { app, prisma };
