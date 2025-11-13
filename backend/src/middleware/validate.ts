import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validate = (
  schema: z.ZodSchema,
  source: 'body' | 'query' | 'params' = 'body'
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req[source] = schema.parse(req[source]);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors[0]?.message || 'Invalid request parameters';
        
        res.status(400).json({
          error: errorMessage, // Return as string instead of object
        });
        return;
      }
      next(error);
    }
  };
};