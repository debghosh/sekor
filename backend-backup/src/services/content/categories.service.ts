import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const categoriesService = {
  async getAll() {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { articles: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return categories;
  },

  async getById(id: number) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        articles: {
          take: 10,
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  },

  async create(name: string, slug: string) {
    const category = await prisma.category.create({
      data: {
        name,
        slug,
      },
    });

    return category;
  },

  async update(id: number, name: string, slug: string) {
    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
      },
    });

    return category;
  },

  async delete(id: number) {
    await prisma.category.delete({
      where: { id },
    });

    return { message: 'Category deleted successfully' };
  },
};
