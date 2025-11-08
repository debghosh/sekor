import api from './api';
import { Article, ArticlesResponse } from '../types/types';

export const articlesService = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    categoryId?: number;
    authorId?: number;
    search?: string;
  }): Promise<ArticlesResponse> {
    const response = await api.get('/articles', { params });
    return response.data;
  },

  async getById(id: number): Promise<Article> {
    const response = await api.get(`/articles/${id}`);
    return response.data.data;
  },

  async create(data: {
    title: string;
    content: string;
    summary?: string;
    categoryId: number;
    image?: string;
    status?: 'DRAFT' | 'PUBLISHED';
  }): Promise<Article> {
    const response = await api.post('/articles', data);
    return response.data.data;
  },

  async update(id: number, data: Partial<{
    title: string;
    content: string;
    summary?: string;
    categoryId: number;
    image?: string;
    status?: 'DRAFT' | 'PUBLISHED';
  }>): Promise<Article> {
    const response = await api.patch(`/articles/${id}`, data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/articles/${id}`);
  },

  async getByAuthor(authorId: number): Promise<Article[]> {
    const response = await api.get(`/articles/author/${authorId}`);
    return response.data.data;
  },
};
