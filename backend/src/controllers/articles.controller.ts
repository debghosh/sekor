import { Response } from 'express';
import { articlesService } from '../services/content/articles.service';
import { AuthRequest } from '../middleware/auth';
import { ResponseHandler } from '../utils/response';
import { PaginationHelper } from '../utils/pagination';

export const articlesController = {
  async list(req: AuthRequest, res: Response) {
    try {
      const { page, per_page, sort, order } = PaginationHelper.parsePaginationParams(req);
      const { categoryId, authorId, status, search } = req.query;

      const result = await articlesService.getAll({
        page,
        limit: per_page,
        categoryId: categoryId as string,
        authorId: authorId as string,
        status: status as string,
        search: search as string,
      });

      const pagination = PaginationHelper.calculatePaginationMeta(
        result.pagination.total,
        page,
        per_page
      );

      const linkHeaders = PaginationHelper.addLinkHeaders(req, page, per_page, pagination.total_pages);
      res.setHeader('Link', linkHeaders.join(', '));

      ResponseHandler.success(res, result.articles, undefined, pagination);
    } catch (error: any) {
      ResponseHandler.internalError(res, error.message, req.id);
    }
  },

  async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const article = await articlesService.getById(id);
      ResponseHandler.success(res, article);
    } catch (error: any) {
      if (error.message.includes('not found')) {
        ResponseHandler.notFound(res, 'Article', req.id);
      } else {
        ResponseHandler.internalError(res, error.message, req.id);
      }
    }
  },

  async create(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ResponseHandler.unauthorized(res, 'Authentication required', req.id);
      }

      const { title, content, summary, categoryId, image, status } = req.body;

      if (!title || !content || !categoryId) {
        return ResponseHandler.badRequest(
          res,
          'Missing required fields',
          [
            ...((!title) ? [{ field: 'title', issue: 'Title is required' }] : []),
            ...((!content) ? [{ field: 'content', issue: 'Content is required' }] : []),
            ...((!categoryId) ? [{ field: 'categoryId', issue: 'Category ID is required' }] : []),
          ],
          req.id
        );
      }

      const article = await articlesService.create({
        title,
        content,
        summary,
        categoryId,
        authorId: req.user.userId,
        image,
        status,
      });

      ResponseHandler.created(res, article, { message: 'Article created successfully' });
    } catch (error: any) {
      ResponseHandler.badRequest(res, error.message, undefined, req.id);
    }
  },

  async update(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ResponseHandler.unauthorized(res, 'Authentication required', req.id);
      }

      const { id } = req.params;
      const { title, content, summary, categoryId, image, status } = req.body;

      const article = await articlesService.update(
        id,
        { title, content, summary, categoryId, image, status },
        req.user.userId
      );

      ResponseHandler.success(res, article, { message: 'Article updated successfully' });
    } catch (error: any) {
      if (error.message.includes('Unauthorized')) {
        ResponseHandler.forbidden(res, error.message, req.id);
      } else if (error.message.includes('not found')) {
        ResponseHandler.notFound(res, 'Article', req.id);
      } else {
        ResponseHandler.badRequest(res, error.message, undefined, req.id);
      }
    }
  },

  async delete(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ResponseHandler.unauthorized(res, 'Authentication required', req.id);
      }

      const { id } = req.params;
      await articlesService.delete(id, req.user.userId);
      ResponseHandler.noContent(res);
    } catch (error: any) {
      if (error.message.includes('Unauthorized')) {
        ResponseHandler.forbidden(res, error.message, req.id);
      } else if (error.message.includes('not found')) {
        ResponseHandler.notFound(res, 'Article', req.id);
      } else {
        ResponseHandler.badRequest(res, error.message, undefined, req.id);
      }
    }
  },

  async getArticlesByAuthor(req: AuthRequest, res: Response) {
    try {
      const { authorId } = req.params;
      const { page, per_page } = PaginationHelper.parsePaginationParams(req);
      
      const articles = await articlesService.getByAuthor(authorId);
      
      ResponseHandler.success(res, articles);
    } catch (error: any) {
      ResponseHandler.internalError(res, error.message, req.id);
    }
  },
};
