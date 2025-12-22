import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Offline detection
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    toast.success('Kết nối internet đã được khôi phục');
  });

  window.addEventListener('offline', () => {
    toast.error('Mất kết nối internet. Vui lòng kiểm tra kết nối của bạn.');
  });
}

// Flag to prevent multiple refresh attempts simultaneously
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - Thêm auth token vào header
api.interceptors.request.use(
  (config) => {
    // Chỉ thêm token khi chạy client-side
    if (typeof window !== 'undefined') {
      // Read token from localStorage where Zustand persists it
      try {
        const authStorage = localStorage.getItem('auth-storage');
        
        if (authStorage) {
          const parsed = JSON.parse(authStorage);
          const token = parsed?.state?.token;
          
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      } catch (e) {
        console.error('Failed to parse auth storage:', e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Centralized error handler
export const handleApiError = (error: AxiosError): string => {
  // Network error (no response from server)
  if (!error.response) {
    if (!navigator.onLine) {
      return 'Không có kết nối internet. Vui lòng kiểm tra kết nối của bạn.';
    }
    return 'Không thể kết nối đến server. Vui lòng thử lại sau.';
  }

  // HTTP error responses
  const status = error.response.status;
  const message = (error.response.data as { message?: string })?.message;

  switch (status) {
    case 400:
      return message || 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
    case 401:
      return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
    case 403:
      return 'Bạn không có quyền thực hiện thao tác này.';
    case 404:
      return message || 'Không tìm thấy dữ liệu.';
    case 409:
      return message || 'Dữ liệu đã tồn tại.';
    case 422:
      return message || 'Dữ liệu không hợp lệ.';
    case 500:
      return 'Lỗi server. Vui lòng thử lại sau.';
    case 502:
      return 'Server tạm thời không khả dụng. Vui lòng thử lại sau.';
    case 503:
      return 'Dịch vụ đang bảo trì. Vui lòng thử lại sau.';
    default:
      return message || 'Có lỗi xảy ra. Vui lòng thử lại.';
  }
};

// Response interceptor - Handle 401 with auto-refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Only attempt refresh for 401 errors, not for auth endpoints themselves
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/api/v1/auth/')
    ) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Get refresh token from localStorage
        const authStorage = localStorage.getItem('auth-storage');
        if (!authStorage) {
          throw new Error('No auth storage found');
        }

        const parsed = JSON.parse(authStorage);
        const refreshToken = parsed?.state?.refreshToken;

        if (!refreshToken) {
          throw new Error('No refresh token found');
        }

        // Call refresh endpoint
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1/auth/refresh`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;

        // Update tokens in store (via localStorage for immediate effect)
        const newState = {
          ...parsed,
          state: {
            ...parsed.state,
            token: newAccessToken,
            refreshToken: newRefreshToken || refreshToken,
          },
        };
        localStorage.setItem('auth-storage', JSON.stringify(newState));
        Cookies.set('auth-token', newAccessToken, { expires: 7, path: '/', sameSite: 'lax' });

        // Process queued requests
        processQueue(null, newAccessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        processQueue(refreshError as Error, null);
        
        // Clear auth state
        localStorage.removeItem('auth-storage');
        Cookies.remove('auth-token');
        
        // Only redirect to login if on admin pages
        // Public pages should continue working without authentication
        if (typeof window !== 'undefined') {
          const isAdminPage = window.location.pathname.startsWith('/taike-manage');
          if (isAdminPage) {
            toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            window.location.href = '/login';
          }
          // For public pages, just silently clear the token and don't redirect
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For non-401 errors, show toast and reject
    if (typeof window !== 'undefined' && error.response?.status !== 401) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    }
    
    return Promise.reject(error);
  }
);

export default api;

