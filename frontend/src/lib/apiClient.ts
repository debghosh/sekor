import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // CRITICAL: Send cookies with requests
});

// Response interceptor - handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as any;

    // Token expired - try to refresh
    if (
      error.response?.status === 401 &&
      error.response?.data?.code === 'TOKEN_EXPIRED' &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        await apiClient.post('/api/v1/auth/refresh');

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout
        console.log('🔒 Refresh failed, logging out...');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    // Other 401 errors - logout immediately
    if (error.response?.status === 401) {
      console.log('🔒 Unauthorized, redirecting to login...');
      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);

export default apiClient;
