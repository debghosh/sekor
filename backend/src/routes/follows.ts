import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.post('/:authorId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const authorId = req.params.authorId;

    const existing = await prisma.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: authorId,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'Already following this author' });
    }

    await prisma.userFollow.create({
      data: {
        followerId: userId,
        followingId: authorId,
      },
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Follow error:', error);
    res.status(500).json({ error: 'Failed to follow author' });
  }
});

router.delete('/:authorId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const authorId = req.params.authorId;

    await prisma.userFollow.deleteMany({
      where: {
        followerId: userId,
        followingId: authorId,
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Unfollow error:', error);
    res.status(500).json({ error: 'Failed to unfollow author' });
  }
});

router.get('/following', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const follows = await prisma.userFollow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followedAuthors = follows.map(f => f.followingId);
    res.json({ followedAuthors });
  } catch (error) {
    console.error('Fetch following error:', error);
    res.status(500).json({ error: 'Failed to fetch followed authors' });
  }
});

export default router;