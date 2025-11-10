//import { PrismaClient, Role } from '@prisma/client';
//import { PrismaClient, Role,  UserStatus, ContentStatus } from '@prisma/client';
import { PrismaClient, Role, UserStatus, ContentStatus } from '.prisma/client';

const prisma = new PrismaClient();

export const authorsService = {
  /**
   * Get all authors with their stats
   */
  async getAuthors(params: {
    page: number;
    limit: number;
    role?: string;
    currentUserId?: string;
  }) {
    const { page, limit, role, currentUserId } = params;
    const skip = (page - 1) * limit;

    // Build filter for authors (users with AUTHOR, EDITOR, or ADMIN role)
    const roleFilter: any = {
      role: {
        in: role ? [role as Role] : [Role.AUTHOR, Role.EDITOR, Role.ADMIN],
      },
      status: 'ACTIVE',
    };

    // Get total count
    const total = await prisma.user.count({
      where: roleFilter,
    });

    // Get authors with stats
    const authors = await prisma.user.findMany({
      where: roleFilter,
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        bio: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            content: {
              where: {
                status: 'PUBLISHED',
              },
            },
            followers: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    // If currentUserId provided, check which authors the user is following
    let followingIds: string[] = [];
    if (currentUserId) {
      const following = await prisma.userFollow.findMany({
        where: {
          followerId: currentUserId,
        },
        select: {
          followingId: true,
        },
      });
      followingIds = following.map((f) => f.followingId);
    }

    // Format response
    const formattedAuthors = authors.map((author) => ({
      id: author.id,
      name: author.name,
      email: author.email,
      avatarUrl: author.avatarUrl,
      bio: author.bio,
      role: author.role,
      storiesCount: author._count.content,
      followersCount: author._count.followers,
      isFollowing: followingIds.includes(author.id),
      createdAt: author.createdAt,
    }));

    return {
      data: formattedAuthors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Get a single author by ID with detailed stats
   */
  async getAuthorById(authorId: string, currentUserId?: string) {
    const author = await prisma.user.findUnique({
      where: {
        id: authorId,
        role: {
          in: [Role.AUTHOR, Role.EDITOR, Role.ADMIN],
        },
        status: 'ACTIVE',
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        bio: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            content: {
              where: {
                status: 'PUBLISHED',
              },
            },
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!author) {
      return null;
    }

    // Check if current user is following this author
    let isFollowing = false;
    if (currentUserId) {
      const follow = await prisma.userFollow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: authorId,
          },
        },
      });
      isFollowing = !!follow;
    }

    return {
      id: author.id,
      name: author.name,
      email: author.email,
      avatarUrl: author.avatarUrl,
      bio: author.bio,
      role: author.role,
      storiesCount: author._count.content,
      followersCount: author._count.followers,
      followingCount: author._count.following,
      isFollowing,
      createdAt: author.createdAt,
    };
  },

  /**
   * Follow an author
   */
  async followAuthor(userId: string, authorId: string) {
    // Check if trying to follow self
    if (userId === authorId) {
      throw new Error('Cannot follow yourself');
    }

    // Check if author exists and has appropriate role
    const author = await prisma.user.findUnique({
      where: {
        id: authorId,
        role: {
          in: [Role.AUTHOR, Role.EDITOR, Role.ADMIN],
        },
        status: 'ACTIVE',
      },
    });

    if (!author) {
      throw new Error('Author not found');
    }

    // Create follow relationship (will be ignored if already exists due to unique constraint)
    await prisma.userFollow.upsert({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: authorId,
        },
      },
      create: {
        followerId: userId,
        followingId: authorId,
      },
      update: {},
    });

    // TODO: Create notification for the author
  },

  /**
   * Unfollow an author
   */
  async unfollowAuthor(userId: string, authorId: string) {
    await prisma.userFollow.delete({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: authorId,
        },
      },
    }).catch(() => {
      // Ignore error if relationship doesn't exist
    });
  },

  /**
   * Get authors that a user is following
   */
  async getFollowingAuthors(
    userId: string,
    params: { page: number; limit: number }
  ) {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    // Get total count
    const total = await prisma.userFollow.count({
      where: {
        followerId: userId,
      },
    });

    // Get followed authors with stats
    const follows = await prisma.userFollow.findMany({
      where: {
        followerId: userId,
      },
      select: {
        following: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            bio: true,
            role: true,
            createdAt: true,
            _count: {
              select: {
                content: {
                  where: {
                    status: 'PUBLISHED',
                  },
                },
                followers: true,
              },
            },
          },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    const formattedAuthors = follows.map((follow) => ({
      id: follow.following.id,
      name: follow.following.name,
      email: follow.following.email,
      avatarUrl: follow.following.avatarUrl,
      bio: follow.following.bio,
      role: follow.following.role,
      storiesCount: follow.following._count.content,
      followersCount: follow.following._count.followers,
      isFollowing: true,
      followedAt: follow.createdAt,
      createdAt: follow.following.createdAt,
    }));

    return {
      data: formattedAuthors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
};
