export interface User {
  id: number;
  email: string;
  name: string;
  bio?: string;
  avatar?: string;
  role: 'USER' | 'ADMIN' | 'CREATOR';
  createdAt: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  summary?: string;
  image?: string;
  status: 'DRAFT' | 'PUBLISHED';
  views: number;
  categoryId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  category: Category;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ArticlesResponse {
  data: Article[];
  pagination: PaginationMeta;
}
