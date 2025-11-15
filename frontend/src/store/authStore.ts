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

// Helper function to check if JWT token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    // Decode JWT payload (middle part between two dots)
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Check expiration (exp is in seconds, Date.now() is in milliseconds)
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    
    return currentTime >= expirationTime;
  } catch (error) {
    // If we can't parse the token, consider it expired
    console.error('Error parsing token:', error);
    return true;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  initialize: () => {
    const user = authService.getStoredUser();
    const token = localStorage.getItem('accessToken');
    
    // Check if token exists AND is not expired
    if (token && !isTokenExpired(token)) {
      // Token is valid
      set({ user, isAuthenticated: true });
    } else {
      // Token is missing or expired - clear everything
      authService.clearAuthData();
      set({ user: null, isAuthenticated: false });
    }
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
        error: errorMessage,
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
      // Extract error message properly
      const errorMessage = 
        error.response?.data?.error?.message || 
        error.response?.data?.error || 
        error.message || 
        'Registration failed';
      
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      // Call backend to clear httpOnly cookies
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if API call fails
    } finally {
      // Clear localStorage data
      authService.clearAuthData();
      set({ user: null, isAuthenticated: false });
      // Redirect to home
      window.location.href = '/';
    }
  },
}));