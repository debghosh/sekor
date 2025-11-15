import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { Language, ContentType, Copyright, ContentStatus } from '@prisma/client';

// Story creation validation
export const createStorySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title must be less than 200 characters'),
  titleBn: z.string().optional(),
  titleEn: z.string().optional(),
  
  abstract: z.string().min(50, 'Abstract must be at least 50 characters').max(500, 'Abstract must be less than 500 characters'),
  abstractBn: z.string().optional(),
  abstractEn: z.string().optional(),
  
  body: z.any(), // Quill Delta JSON - validated separately
  bodyBn: z.any().optional(),
  bodyEn: z.any().optional(),
  
  thumbnail: z.string().url().optional(),
  thumbnailAlt: z.string().optional(),
  
  categoryId: z.string().uuid('Invalid category ID'),
  tags: z.array(z.string()).optional(),
  locationIds: z.array(z.string().uuid()).optional(),
  
  language: z.nativeEnum(Language).optional(),
  contentType: z.nativeEnum(ContentType).optional(),
  
  copyright: z.nativeEnum(Copyright).optional(),
  allowComments: z.boolean().optional(),
  allowSharing: z.boolean().optional(),
  isPremium: z.boolean().optional(),
  
  coAuthorIds: z.array(z.string().uuid()).optional(),
  
  sources: z.array(z.object({
    type: z.string(),
    title: z.string(),
    author: z.string().optional(),
    url: z.string().url().optional(),
    dateAccessed: z.string().datetime().optional(),
    notes: z.string().optional(),
  })).optional(),
});

// Story update validation (all fields optional)
export const updateStorySchema = createStorySchema.partial().extend({
  status: z.nativeEnum(ContentStatus).optional(),
  scheduledFor: z.string().datetime().optional(),
  expiryDate: z.string().datetime().optional(),
});

// Query params validation
export const storyQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  authorId: z.string().uuid().optional(),
  status: z.nativeEnum(ContentStatus).optional(),
  categoryId: z.string().uuid().optional(),
  language: z.nativeEnum(Language).optional(),
  contentType: z.nativeEnum(ContentType).optional(),
  search: z.string().max(100).optional(),
  locationId: z.string().uuid().optional(),
  sortBy: z.enum(['createdAt', 'publishedAt', 'viewCount', 'reactionCount']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// UUID param validation
export const uuidParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

// Media upload validation
export const mediaMetadataSchema = z.object({
  altText: z.string().max(200).optional(),
  caption: z.string().max(1000).optional(),
  credit: z.string().max(200).optional(),
});

// Media query params
export const mediaQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  type: z.enum(['IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT']).optional(),
  search: z.string().max(100).optional(),
  sortBy: z.enum(['createdAt', 'size', 'usageCount']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Story-media attachment
export const attachMediaSchema = z.object({
  storyId: z.string().uuid('Invalid story ID'),
  mediaId: z.string().uuid('Invalid media ID'),
  order: z.number().int().min(0).default(0),
});

// Validation middleware factory
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
          error: errorMessage,
          details: error.errors,
          request_id: (req as any).id,
        });
        return;
      }
      next(error);
    }
  };
};

// Custom Quill Delta validation
export const validateQuillContent = (req: Request, res: Response, next: NextFunction): void => {
  const { body } = req.body;
  
  if (!body) {
    res.status(400).json({
      error: 'Story body is required',
      request_id: (req as any).id,
    });
    return;
  }

  // Check if it's valid Quill Delta format
  if (!body.ops || !Array.isArray(body.ops)) {
    res.status(400).json({
      error: 'Invalid story body format. Expected Quill Delta format.',
      request_id: (req as any).id,
    });
    return;
  }

  // Check minimum content length (at least 100 characters)
  const textContent = body.ops
    .map((op: any) => (typeof op.insert === 'string' ? op.insert : ''))
    .join('');
  
  const wordCount = textContent.trim().split(/\s+/).filter((word: string) => word.length > 0).length;
  
  if (wordCount < 50) {
    res.status(400).json({
      error: 'Story body must contain at least 50 words',
      request_id: (req as any).id,
    });
    return;
  }

  next();
};

// File upload validation middleware
export const validateFileUpload = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.file) {
    res.status(400).json({
      error: 'No file uploaded',
      request_id: (req as any).id,
    });
    return;
  }

  const maxSize = 100 * 1024 * 1024; // 100MB
  if (req.file.size > maxSize) {
    res.status(400).json({
      error: 'File size exceeds maximum allowed (100MB)',
      request_id: (req as any).id,
    });
    return;
  }

  next();
};
