import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role?: string;
  };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  // Get token from cookie instead of Authorization header
  const token = req.cookies.accessToken;

  if (!token) {
    res.status(401).json({ 
      error: 'No token',
      code: 'NO_TOKEN' 
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ 
        error: 'Token expired',
        code: 'TOKEN_EXPIRED' 
      });
      return;
    }
    
    if (process.env.NODE_ENV !== 'test') {
      console.error('❌ Token verification failed:', error);
    }
    
    res.status(401).json({ 
      error: 'Invalid token',
      code: 'INVALID_TOKEN' 
    });
    return;
  }
};

export const authMiddleware = authenticateToken;

export const optionalAuthMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Get token from cookie
  const token = req.cookies.accessToken;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
    } catch (error) {
      // Token invalid, continue without user
    }
  }
  
  next();
};
