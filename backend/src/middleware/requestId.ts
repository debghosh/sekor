import { Request, Response, NextFunction } from 'express';
import { randomBytes } from 'crypto';

declare global {
  namespace Express {
    interface Request {
      id: string;
    }
  }
}

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const requestId = req.get('X-Request-ID') || `req_${randomBytes(16).toString('hex')}`;
  req.id = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
};
