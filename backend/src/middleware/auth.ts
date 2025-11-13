import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  console.log('🔐 Auth middleware - Headers:', req.headers.authorization);
  
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    res.status(401).json({ error: 'No token' });
    return;
  }
  
  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'No token' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    console.log('✅ Token verified:', decoded);
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };
    next();
  } catch (error) {
    console.error('❌ Token verification failed:', error);
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
};

export const authMiddleware = authenticateToken;

export const optionalAuthMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
      };
    } catch (error) {
      // Token invalid, continue without user
    }
  }
  
  next();
};