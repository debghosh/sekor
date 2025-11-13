import apiClient from '../lib/apiClient';
import { User } from '../types/types';

interface AuthResponse {
  message: string;
  data: {
    user: User;
    // No tokens in response - they're in httpOnly cookies!
  };
}

export const authService = {
  // Login
  async login(email: string, password: string): Promise<{ user: User }> {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return { user: response.data.data.user };
  },

  // Register
  async register(email: string, password: string, name: string): Promise<{ user: User }> {
    const response = await apiClient.post<AuthResponse>('/auth/register', {
      email,
      password,
      name,
    });
    return { user: response.data.data.user };
  },

  // Logout
  async logout(): Promise<void> {
    await apiClient.post('auth/logout');
  },

  // Get profile
  async getProfile(): Promise<User> {
    const response = await apiClient.get<{ data: User }>('auth/profile');
    return response.data.data;
  },

  // Save auth data (only user info, no tokens)
  saveAuthData(data: { user: User }): void {
    localStorage.setItem('user', JSON.stringify(data.user));
    // NO TOKEN STORAGE - tokens are in httpOnly cookies!
  },

  // Get stored user
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  // Check if authenticated (by checking if user exists in localStorage)
  isAuthenticated(): boolean {
    return !!this.getStoredUser();
  },

  // Clear auth data
  clearAuthData(): void {
    localStorage.removeItem('user');
    // Cookies are cleared by backend on logout
  },
};
