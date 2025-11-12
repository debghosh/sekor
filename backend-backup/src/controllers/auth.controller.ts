import { Request, Response } from 'express';
import { authService } from '../services/auth/auth.service';
import { AuthRequest } from '../middleware/auth';

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        res.status(400).json({ error: 'Email, password, and name are required' });
        return;
      }

      const result = await authService.register({ email, password, name });

      res.status(201).json({
        message: 'User registered successfully',
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      const result = await authService.login({ email, password });

      res.status(200).json({
        message: 'Login successful',
        data: result,
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  },

  async getProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const profile = await authService.getProfile(req.user.userId);

      res.status(200).json({
        data: profile,
      });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  },

  async logout(req: Request, res: Response) {
    // In a stateless JWT setup, logout is handled client-side
    // If using refresh tokens in DB, you'd invalidate them here
    res.status(200).json({ message: 'Logout successful' });
  },
};
