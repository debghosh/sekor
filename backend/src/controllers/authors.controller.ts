import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { authorsService } from '../services/content/authors.service';

export const authorsController = {
  /**
   * Get all authors with their stats
   * GET /api/authors
   */
  async getAuthors(req: AuthRequest, res: Response) {
    try {
      const { page = 1, limit = 20, role } = req.query;
      const userId = req.user?.userId; // Changed from id to userId

      const result = await authorsService.getAuthors({
        page: Number(page),
        limit: Number(limit),
        role: role as string,
        currentUserId: userId,
      });

      res.json(result);
    } catch (error) {
      console.error('Get authors error:', error);
      res.status(500).json({ error: 'Failed to fetch authors' });
    }
  },

  /**
   * Get a single author's profile with stats
   * GET /api/authors/:id
   */
  async getAuthorById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId; // Changed from id to userId

      const author = await authorsService.getAuthorById(id, userId);

      if (!author) {
        return res.status(404).json({ error: 'Author not found' });
      }

      res.json(author);
    } catch (error) {
      console.error('Get author error:', error);
      res.status(500).json({ error: 'Failed to fetch author' });
    }
  },

  /**
   * Follow an author
   * POST /api/authors/:id/follow
   */
  async followAuthor(req: AuthRequest, res: Response) {
    try {
      const { id: authorId } = req.params;
      const userId = req.user?.userId; // Changed from id to userId

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      await authorsService.followAuthor(userId, authorId);

      res.json({ success: true, message: 'Author followed successfully' });
    } catch (error: any) {
      console.error('Follow author error:', error);
      if (error.message === 'Cannot follow yourself') {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === 'Author not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to follow author' });
    }
  },

  /**
   * Unfollow an author
   * DELETE /api/authors/:id/follow
   */
  async unfollowAuthor(req: AuthRequest, res: Response) {
    try {
      const { id: authorId } = req.params;
      const userId = req.user?.userId; // Changed from id to userId

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      await authorsService.unfollowAuthor(userId, authorId);

      res.json({ success: true, message: 'Author unfollowed successfully' });
    } catch (error) {
      console.error('Unfollow author error:', error);
      res.status(500).json({ error: 'Failed to unfollow author' });
    }
  },

  /**
   * Get authors that the current user is following
   * GET /api/authors/following/list
   */
  async getFollowingAuthors(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId; // Changed from id to userId

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { page = 1, limit = 20 } = req.query;

      const result = await authorsService.getFollowingAuthors(userId, {
        page: Number(page),
        limit: Number(limit),
      });

      res.json(result);
    } catch (error) {
      console.error('Get following authors error:', error);
      res.status(500).json({ error: 'Failed to fetch following authors' });
    }
  },
};