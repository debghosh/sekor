import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { mediaService } from '../services/content/media.service';
import { ResponseHandler } from '../utils/response';

// Temporary type until Prisma regenerates
type MediaType = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT';

export const mediaController = {
  /**
   * Upload media file
   */
  async upload(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ResponseHandler.unauthorized(res, 'Authentication required', req.id);
      }

      if (!req.file) {
        return ResponseHandler.badRequest(res, 'No file uploaded', undefined, req.id);
      }

      const media = await mediaService.upload(req.user.userId, {
        file: req.file as any,
        altText: req.body.altText,
        caption: req.body.caption,
        credit: req.body.credit,
      });

      // Fixed: ResponseHandler.created expects (res, data)
      ResponseHandler.created(res, { 
        ...media,
        message: 'Media uploaded successfully' 
      });
    } catch (error: any) {
      console.error('[Media] Upload error:', error);
      ResponseHandler.badRequest(res, error.message, undefined, req.id);
    }
  },

  /**
   * Get media by ID
   */
  async getById(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ResponseHandler.unauthorized(res, 'Authentication required', req.id);
      }

      const { id } = req.params;
      const media = await mediaService.getById(id, req.user.userId);

      ResponseHandler.success(res, media);
    } catch (error: any) {
      console.error('[Media] GetById error:', error);

      if (error.message === 'Media not found') {
        return ResponseHandler.notFound(res, 'Media', req.id);
      }
      if (error.message === 'Access denied') {
        return ResponseHandler.forbidden(res, 'You do not have access to this media', req.id);
      }

      ResponseHandler.internalError(res, error.message, req.id);
    }
  },

  /**
   * Get all media (for current user)
   */
  async getAll(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ResponseHandler.unauthorized(res, 'Authentication required', req.id);
      }

      const filters = {
        userId: req.user.userId,
        type: req.query.type as MediaType,
        search: req.query.search as string,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        sortBy: (req.query.sortBy as any) || 'createdAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
      };

      const result = await mediaService.getAll(filters);

      ResponseHandler.success(
        res,
        result.data,
        result.pagination
      );
    } catch (error: any) {
      console.error('[Media] GetAll error:', error);
      ResponseHandler.internalError(res, error.message, req.id);
    }
  },

  /**
   * Update media metadata
   */
  async update(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ResponseHandler.unauthorized(res, 'Authentication required', req.id);
      }

      const { id } = req.params;
      const { altText, caption, credit } = req.body;

      const media = await mediaService.update(id, req.user.userId, {
        altText,
        caption,
        credit,
      });

      ResponseHandler.success(res, {
        ...media,
        message: 'Media updated successfully',
      });
    } catch (error: any) {
      console.error('[Media] Update error:', error);

      if (error.message === 'Media not found') {
        return ResponseHandler.notFound(res, 'Media', req.id);
      }
      if (error.message === 'Access denied') {
        return ResponseHandler.forbidden(res, 'You do not have permission to edit this media', req.id);
      }

      ResponseHandler.badRequest(res, error.message, undefined, req.id);
    }
  },

  /**
   * Delete media
   */
  async delete(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ResponseHandler.unauthorized(res, 'Authentication required', req.id);
      }

      const { id } = req.params;
      const result = await mediaService.delete(id, req.user.userId);

      ResponseHandler.success(res, result);
    } catch (error: any) {
      console.error('[Media] Delete error:', error);

      if (error.message === 'Media not found') {
        return ResponseHandler.notFound(res, 'Media', req.id);
      }
      if (error.message === 'Access denied') {
        return ResponseHandler.forbidden(res, 'You do not have permission to delete this media', req.id);
      }
      if (error.message.includes('being used in stories')) {
        return ResponseHandler.badRequest(res, error.message, undefined, req.id);
      }

      ResponseHandler.internalError(res, error.message, req.id);
    }
  },

  /**
   * Attach media to story
   */
  async attachToStory(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ResponseHandler.unauthorized(res, 'Authentication required', req.id);
      }

      const { storyId, mediaId } = req.body;
      const order = req.body.order || 0;

      const storyMedia = await mediaService.attachToStory(storyId, mediaId, order);

      ResponseHandler.success(res, {
        ...storyMedia,
        message: 'Media attached to story',
      });
    } catch (error: any) {
      console.error('[Media] AttachToStory error:', error);
      ResponseHandler.badRequest(res, error.message, undefined, req.id);
    }
  },

  /**
   * Detach media from story
   */
  async detachFromStory(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ResponseHandler.unauthorized(res, 'Authentication required', req.id);
      }

      const { storyId, mediaId } = req.body;

      const result = await mediaService.detachFromStory(storyId, mediaId);

      ResponseHandler.success(res, result);
    } catch (error: any) {
      console.error('[Media] DetachFromStory error:', error);
      ResponseHandler.badRequest(res, error.message, undefined, req.id);
    }
  },

  /**
   * Get storage usage
   */
  async getStorageUsage(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ResponseHandler.unauthorized(res, 'Authentication required', req.id);
      }

      const usage = await mediaService.getStorageUsage(req.user.userId);

      ResponseHandler.success(res, usage);
    } catch (error: any) {
      console.error('[Media] GetStorageUsage error:', error);
      ResponseHandler.internalError(res, error.message, req.id);
    }
  },
};
