import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateArticleInput {
  title: string;
  content: string;
  summary?: string;
  categoryId: number;
  authorId: number;
  image?: string;
  status?: 'DRAFT' | 'PUBLISHED';
}

export interface UpdateArticleInput {
  title?: string;
  content?: string;
  summary?: string;
  categoryId?: number;
  image?: string;
  status?: 'DRAFT' | 'PUBLISHED';
}

export const articlesService = {
  async getAll(options: {
    page?: number;
    limit?: number;
    categoryId?: number;
    authorId?: number;
    status?: string;
    search?: string;
  }) {
    const {
      page = 1,
      limit = 10,
      categoryId,
      authorId,
      status,
      search,
    } = options;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (categoryId) where.categoryId = categoryId;
    if (authorId) where.authorId = authorId;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.article.count({ where }),
    ]);

    return {
      articles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getById(id: number) {
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            bio: true,
            avatar: true,
          },
        },
        category: true,
      },
    });

    if (!article) {
      throw new Error('Article not found');
    }

    // Increment view count
    await prisma.article.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return article;
  },

  async create(input: CreateArticleInput) {
    const article = await prisma.article.create({
      data: {
        title: input.title,
        content: input.content,
        summary: input.summary,
        categoryId: input.categoryId,
        authorId: input.authorId,
        image: input.image,
        status: input.status || 'DRAFT',
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        category: true,
      },
    });

    return article;
  },

  async update(id: number, input: UpdateArticleInput, userId: number) {
    // Check if article exists and user is the author
    const existingArticle = await prisma.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      throw new Error('Article not found');
    }

    if (existingArticle.authorId !== userId) {
      throw new Error('Unauthorized to update this article');
    }

    const article = await prisma.article.update({
      where: { id },
      data: input,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        category: true,
      },
    });

    return article;
  },

  async delete(id: number, userId: number) {
    // Check if article exists and user is the author
    const existingArticle = await prisma.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      throw new Error('Article not found');
    }

    if (existingArticle.authorId !== userId) {
      throw new Error('Unauthorized to delete this article');
    }

    await prisma.article.delete({
      where: { id },
    });

    return { message: 'Article deleted successfully' };
  },

  async getByAuthor(authorId: number) {
    const articles = await prisma.article.findMany({
      where: { authorId },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return articles;
  },
};
