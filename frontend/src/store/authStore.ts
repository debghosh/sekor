import { create } from 'zustand';
import { User } from '../types/types';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  initialize: () => {
    const user = authService.getStoredUser();
    const isAuthenticated = authService.isAuthenticated();
    set({ user, isAuthenticated });
  },

 login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.login(email, password);
      authService.saveAuthData(data);
      set({ user: data.user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      // Extract error message properly
      const errorMessage = 
        error.response?.data?.error?.message || 
        error.response?.data?.error || 
        error.message || 
        'Login failed';
      
      set({
        error: errorMessage,  // Now it's always a string
        isLoading: false,
      });
      throw error;
    }
  },

register: async (email: string, password: string, name: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.register(email, password, name);
      authService.saveAuthData(data);
      set({ user: data.user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      // Extract error message properly (same as login)
      const errorMessage = 
        error.response?.data?.error?.message || 
        error.response?.data?.error || 
        error.message || 
        'Registration failed';
      
      set({
        error: errorMessage,  // Now it's always a string
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      // Call backend to clear cookies
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if API call fails
    } finally {
      // Clear local state
      authService.clearAuthData();
      set({ user: null, isAuthenticated: false });
      // Redirect to home
      window.location.href = '/';
    }
  },
}));
