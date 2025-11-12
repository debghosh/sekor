import { Response } from 'express';
import { articlesService } from '../services/content/articles.service';
import { AuthRequest } from '../middleware/auth';

export const articlesController = {
  async getAll(req: AuthRequest, res: Response) {
    try {
      const {
        page,
        limit,
        categoryId,
        authorId,
        status,
        search,
      } = req.query;

      const result = await articlesService.getAll({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        categoryId: categoryId as string,
        authorId: authorId as string,
        status: status as string,
        search: search as string,
      });

      res.status(200).json({
        data: result.articles,
        pagination: result.pagination,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const article = await articlesService.getById(id);

      res.status(200).json({
        data: article,
      });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  },

  async create(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { title, content, summary, categoryId, image, status } = req.body;

      if (!title || !content || !categoryId) {
        res.status(400).json({ 
          error: 'Title, content, and categoryId are required' 
        });
        return;
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

      res.status(201).json({
        message: 'Article created successfully',
        data: article,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async update(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const { title, content, summary, categoryId, image, status } = req.body;

      const article = await articlesService.update(
        id,
        {
          title,
          content,
          summary,
          categoryId,
          image,
          status,
        },
        req.user.userId
      );

      res.status(200).json({
        message: 'Article updated successfully',
        data: article,
      });
    } catch (error: any) {
      const statusCode = error.message.includes('Unauthorized') ? 403 : 
                         error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({ error: error.message });
    }
  },

  async delete(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const result = await articlesService.delete(
        id,
        req.user.userId
      );

      res.status(200).json(result);
    } catch (error: any) {
      const statusCode = error.message.includes('Unauthorized') ? 403 : 
                         error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({ error: error.message });
    }
  },

  async getByAuthor(req: AuthRequest, res: Response) {
    try {
      const { authorId } = req.params;
      const articles = await articlesService.getByAuthor(authorId);

      res.status(200).json({
        data: articles,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};
