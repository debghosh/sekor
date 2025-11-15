import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { storyService } from '../services/content/story.service';
import { ResponseHandler } from '../utils/response';
import { ContentStatus } from '@prisma/client';

export const storiesController = {
  /**
   * Create a new story (draft)
   */
  async create(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ResponseHandler.unauthorized(res, 'Authentication required', req.id);
      }

      const story = await storyService.create(req.user.userId, req.body);
      
      // Fixed: wrap data with message
      ResponseHandler.created(res, {
        ...story,
        message: 'Story created successfully',
      });
    } catch (error: any) {
      console.error('[Stories] Create error:', error);
      ResponseHandler.badRequest(res, error.message, undefined, req.id);
    }
  },

  /**
   * Get story by ID
   */
  async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const story = await storyService.getById(id, userId);
      
      // Increment view count if published
      if (story.status === ContentStatus.PUBLISHED) {
        await storyService.incrementView(id);
      }

      ResponseHandler.success(res, story);
    } catch (error: any) {
      console.error('[Stories] GetById error:', error);
      
      if (error.message === 'Story not found') {
        return ResponseHandler.notFound(res, 'Story', req.id);
      }
      if (error.message === 'Access denied') {
        return ResponseHandler.forbidden(res, 'You do not have access to this story', req.id);
      }
      
      ResponseHandler.internalError(res, error.message, req.id);
    }
  },

  /**
   * Get all stories (with filters)
   */
  async getAll(req: AuthRequest, res: Response) {
    try {
      const filters = {
        authorId: req.query.authorId as string,
        status: req.query.status as ContentStatus,
        categoryId: req.query.categoryId as string,
        language: req.query.language as any,
        contentType: req.query.contentType as any,
        search: req.query.search as string,
        locationId: req.query.locationId as string,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: (req.query.sortBy as any) || 'createdAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
      };

      const result = await storyService.getAll(filters);
      
      ResponseHandler.success(
        res,
        result.data,
        result.pagination
      );
    } catch (error: any) {
      console.error('[Stories] GetAll error:', error);
      ResponseHandler.internalError(res, error.message, req.id);
    }
  },

  /**
   * Get my stories (for creator dashboard)
   */
  async getMyStories(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ResponseHandler.unauthorized(res, 'Authentication required', req.id);
      }

      const filters = {
        authorId: req.user.userId,
        status: req.query.status as ContentStatus,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: (req.query.sortBy as any) || 'updatedAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
      };

      const result = await storyService.getAll(filters);
      
      ResponseHandler.success(
        res,
        result.data,
        result.pagination
      );
    } catch (error: any) {
      console.error('[Stories] GetMyStories error:', error);
      ResponseHandler.internalError(res, error.message, req.id);
    }
  },

  /**
   * Update story
   */
  async update(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ResponseHandler.unauthorized(res, 'Authentication required', req.id);
      }

      const { id } = req.params;
      const story = await storyService.update(id, req.user.userId, req.body);
      
      ResponseHandler.success(res, {
        ...story,
        message: 'Story updated successfully',
      });
    } catch (error: any) {
      console.error('[Stories] Update error:', error);
      
      if (error.message === 'Story not found') {
        return ResponseHandler.notFound(res, 'Story', req.id);
      }
      if (error.message === 'Access denied') {
        return ResponseHandler.forbidden(res, 'You do not have permission to edit this story', req.id);
      }
      
      ResponseHandler.badRequest(res, error.message, undefined, req.id);
    }
  },

  /**
   * Delete story
   */
  async delete(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ResponseHandler.unauthorized(res, 'Authentication required', req.id);
      }

      const { id } = req.params;
      const result = await storyService.delete(id, req.user.userId);
      
      ResponseHandler.success(res, result);
    } catch (error: any) {
      console.error('[Stories] Delete error:', error);
      
      if (error.message === 'Story not found') {
        return ResponseHandler.notFound(res, 'Story', req.id);
      }
      if (error.message.includes('Only the author')) {
        return ResponseHandler.forbidden(res, error.message, req.id);
      }
      
      ResponseHandler.internalError(res, error.message, req.id);
    }
  },

  /**
   * Submit story for review
   */
  async submit(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ResponseHandler.unauthorized(res, 'Authentication required', req.id);
      }

      const { id } = req.params;
      const story = await storyService.submit(id, req.user.userId);
      
      ResponseHandler.success(res, {
        ...story,
        message: 'Story submitted for review',
      });
    } catch (error: any) {
      console.error('[Stories] Submit error:', error);
      
      if (error.message === 'Story not found') {
        return ResponseHandler.notFound(res, 'Story', req.id);
      }
      if (error.message === 'Access denied') {
        return ResponseHandler.forbidden(res, 'You do not have permission to submit this story', req.id);
      }
      
      ResponseHandler.badRequest(res, error.message, undefined, req.id);
    }
  },

  /**
   * Publish story (if approved)
   */
  async publish(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ResponseHandler.unauthorized(res, 'Authentication required', req.id);
      }

      const { id } = req.params;
      const story = await storyService.publish(id, req.user.userId);
      
      ResponseHandler.success(res, {
        ...story,
        message: 'Story published successfully',
      });
    } catch (error: any) {
      console.error('[Stories] Publish error:', error);
      
      if (error.message === 'Story not found') {
        return ResponseHandler.notFound(res, 'Story', req.id);
      }
      if (error.message.includes('must be approved')) {
        return ResponseHandler.badRequest(res, error.message, undefined, req.id);
      }
      
      ResponseHandler.forbidden(res, error.message, req.id);
    }
  },

  /**
   * Archive story
   */
  async archive(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ResponseHandler.unauthorized(res, 'Authentication required', req.id);
      }

      const { id } = req.params;
      const story = await storyService.archive(id, req.user.userId);
      
      ResponseHandler.success(res, {
        ...story,
        message: 'Story archived successfully',
      });
    } catch (error: any) {
      console.error('[Stories] Archive error:', error);
      
      if (error.message === 'Story not found') {
        return ResponseHandler.notFound(res, 'Story', req.id);
      }
      
      ResponseHandler.forbidden(res, error.message, req.id);
    }
  },

  /**
   * Get story statistics (for creator)
   */
  async getStats(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ResponseHandler.unauthorized(res, 'Authentication required', req.id);
      }

      const { id } = req.params;
      
      // Verify ownership
      const story = await storyService.getById(id, req.user.userId);
      
      if (story.authorId !== req.user.userId) {
        return ResponseHandler.forbidden(res, 'Access denied', req.id);
      }

      // Get analytics
      const stats = {
        views: story.viewCount,
        uniqueVisitors: story.uniqueVisitors,
        reactions: story.reactionCount,
        comments: story.commentCount,
        shares: story.shareCount,
        bookmarks: story.bookmarkCount,
      };
      
      ResponseHandler.success(res, stats);
    } catch (error: any) {
      console.error('[Stories] GetStats error:', error);
      ResponseHandler.internalError(res, error.message, req.id);
    }
  },
};
