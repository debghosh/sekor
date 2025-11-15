import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import storiesRoutes from './routes/stories.routes';
import mediaRoutes from './routes/media.routes';
import { requestIdMiddleware } from './middleware/requestId';
import { deprecationMiddleware } from './middleware/deprecation';
import authRoutes from './routes/auth.routes';
import articlesRoutes from './routes/articles.routes';
import authorsRoutes from './routes/authors.routes';
import followsRoutes from './routes/follows.routes';
import { ResponseHandler } from './utils/response';
import { Server } from 'http';  
import { randomUUID } from 'crypto';
import { apiLimiter } from './middleware/rateLimiting';
import cookieParser from 'cookie-parser';

const app: Express = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cookieParser());

// Security & CORS (FIRST)
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request ID middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const requestId = randomUUID();
  req.id = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
});

// Request logging
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${req.id}] ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check (BEFORE rate limiter)
app.get('/health', (_req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API root endpoint (BEFORE rate limiter)
app.get('/api/v1', (_req: Request, res: Response) => {
  res.json({
    data: {
      version: '1.0.0',
      name: 'SEKOR-BKC API',
      endpoints: [
        { method: 'GET', path: '/health', description: 'Health check' },
        { method: 'GET', path: '/api/v1', description: 'API info' },
        { method: 'GET', path: '/api/v1/articles', description: 'List articles' },
        { method: 'GET', path: '/api/v1/authors', description: 'List authors' },
      ]
    }
  });
});

// Deprecation redirect (BEFORE routes)
app.use('/api/auth', (_req: Request, res: Response) => {
  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + 6);

  res.set({
    'Deprecation': 'true',
    'Sunset': futureDate.toUTCString(),
    'Link': '</api/v1/auth>; rel="alternate"'
  });

  res.redirect(307, '/api/v1/auth');
});

// Rate limiter (AFTER health/api root, BEFORE other routes)
if (process.env.NODE_ENV === 'production') {
  app.use('/api/v1', apiLimiter);
}

// API Routes - v1 (AFTER rate limiter, BEFORE error handlers)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/articles', articlesRoutes);
app.use('/api/v1/authors', authorsRoutes);
app.use('/api/v1/follows', followsRoutes);

// NEW Creator Portal routes
app.use('/api/v1/stories', storiesRoutes);
app.use('/api/v1/media', mediaRoutes);

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// 404 handler (AFTER all routes)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: {
      code: 'RESOURCE_NOT_FOUND',
      message: 'Endpoint not found',
      timestamp: new Date().toISOString(),
      request_id: req.id || req.headers['x-request-id'],
    }
  });
});

// Global error handler (LAST)
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error(`[${req.id}] Error:`, err);
  
  const statusCode = err.status || err.statusCode || 500;
  
  res.status(statusCode).json({
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'Internal server error',
      timestamp: new Date().toISOString(),
      request_id: req.id || req.headers['x-request-id'],
    }
  });
});

// Declare server outside the if block
let server: Server | undefined;

// Start server only in non-test mode
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
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
}

// Graceful shutdown
const shutdown = async () => {
  console.log('\n🛑 Shutting down gracefully...');
  
  const forceShutdownTimer = setTimeout(() => {
    console.error('⚠️  Forcing shutdown...');
    process.exit(1);
  }, 10000);
  
  try {
    if (server) {
      server.close(async () => {
        await prisma.$disconnect();
        clearTimeout(forceShutdownTimer);
        console.log('✅ Server shut down complete');
        process.exit(0);
      });
    } else {
      await prisma.$disconnect();
      clearTimeout(forceShutdownTimer);
      console.log('✅ Cleanup complete');
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    clearTimeout(forceShutdownTimer);
    process.exit(1);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export { app, prisma };