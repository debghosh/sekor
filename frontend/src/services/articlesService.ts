import { api } from './api';
import { Article, ArticlesResponse } from '../types/types';

export const articlesService = {
  async getAll(params?: {
    page?: number;
    per_page?: number;
    categoryId?: string;
    authorId?: string;
    search?: string;
    status?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  }): Promise<ArticlesResponse> {
    const response = await api.get('/articles', { params });
    // Backend returns { data, pagination } format
    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  },

  async getById(id: string): Promise<Article> {
    const response = await api.get(`/articles/${id}`);
    // Extract from { data: {...} } wrapper
    return response.data.data;
  },

  async create(data: {
    title: string;
    content: string;
    summary?: string;
    categoryId: string;
    image?: string;
    status?: 'DRAFT' | 'PUBLISHED';
  }): Promise<Article> {
    const response = await api.post('/articles', data);
    // Extract from { data: {...} } wrapper
    return response.data.data;
  },

  async update(
    id: string,
    data: Partial<{
      title: string;
      content: string;
      summary?: string;
      categoryId: string;
      image?: string;
      status?: 'DRAFT' | 'PUBLISHED';
    }>
  ): Promise<Article> {
    const response = await api.patch(`/articles/${id}`, data);
    // Extract from { data: {...} } wrapper
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/articles/${id}`);
    // DELETE returns 204 No Content
  },

  async getByAuthor(authorId: string): Promise<Article[]> {
    // Use filter query parameter
    const response = await api.get('/articles', {
      params: { authorId },
    });
    return response.data.data;
  },
};
