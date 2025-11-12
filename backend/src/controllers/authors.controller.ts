import { Response } from 'express';
import { authorsService } from '../services/content/authors.service';
import { AuthRequest } from '../middleware/auth';
import { ResponseHandler } from '../utils/response';
import { PaginationHelper } from '../utils/pagination';

export const authorsController = {
  async list(req: AuthRequest, res: Response) {
    try {
      const { page, per_page } = PaginationHelper.parsePaginationParams(req);
      const result = await authorsService.getAuthors({
        page,
        limit: per_page,
        currentUserId: req.user?.userId
      });
      
      // Convert pagination format
      const pagination = {
        page: result.pagination.page,
        per_page: result.pagination.limit,
        total: result.pagination.total,
        total_pages: result.pagination.totalPages
      };
      
      ResponseHandler.success(res, result.data, undefined, pagination);
    } catch (error: any) {
      ResponseHandler.internalError(res, error.message, req.id);
    }
  },

  async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const author = await authorsService.getAuthorById(id, req.user?.userId);
      ResponseHandler.success(res, author);
    } catch (error: any) {
      if (error.message.includes('not found')) {
        ResponseHandler.notFound(res, 'Author', req.id);
      } else {
        ResponseHandler.internalError(res, error.message, req.id);
      }
    }
  },

  async followAuthor(req: AuthRequest, res: Response) {

    console.log("Controller req.params:", req.params);
    try {
      if (!req.user) {
        return ResponseHandler.unauthorized(res, 'Authentication required', req.id);
      }

      const { authorId: authorId } = req.params;
      console.log ("authorId in controller: ", authorId);

      await authorsService.followAuthor(req.user.userId, req.params.authorId);
      ResponseHandler.created(res, { followed: true }, { message: 'Author followed successfully' });
    } catch (error: any) {
      if (error.message.includes('already following')) {
        ResponseHandler.conflict(res, 'Already following this author', req.id);
      } else {
        ResponseHandler.internalError(res, error.message, req.id);
      }
    }
  },

  async unfollowAuthor(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ResponseHandler.unauthorized(res, 'Authentication required', req.id);
      }

      const { id: authorId } = req.params;
      await authorsService.unfollowAuthor(req.user.userId, authorId);
      ResponseHandler.noContent(res);
    } catch (error: any) {
      ResponseHandler.internalError(res, error.message, req.id);
    }
  },

  async getFollowing(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ResponseHandler.unauthorized(res, 'Authentication required', req.id);
      }

      const { page, per_page } = PaginationHelper.parsePaginationParams(req);
      
      const result = await authorsService.getFollowingAuthors(req.user.userId, {
        page,
        limit: per_page
      });
      
      // Convert pagination format
      const pagination = {
        page: result.pagination.page,
        per_page: result.pagination.limit,
        total: result.pagination.total,
        total_pages: result.pagination.totalPages
      };
      
      ResponseHandler.success(res, result.data, undefined, pagination);
    } catch (error: any) {
      ResponseHandler.internalError(res, error.message, req.id);
    }
  },
};