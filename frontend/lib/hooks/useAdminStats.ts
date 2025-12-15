import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

// Types matching backend DTOs
export interface AdminStatsResponse {
  totalProperties: number;
  totalRequests: number;
  newRequestsToday: number;
  activeProperties: number;
}

export interface TopPropertyResponse {
  propertyCode: string;
  propertyName: string;
  thumbnailUrl: string;
  requestCount: number;
}

export interface MonthlyStatsResponse {
  year: number;
  month: number;
  requestCount: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Fetch overall admin statistics
export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<AdminStatsResponse>>('/api/v1/admin/stats');
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Fetch top properties by request count
export const useTopProperties = (limit: number = 5) => {
  return useQuery({
    queryKey: ['admin', 'top-properties', limit],
    queryFn: async () => {
      const response = await api.get<ApiResponse<TopPropertyResponse[]>>(
        `/api/v1/admin/top-properties?limit=${limit}`
      );
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Fetch monthly statistics
export const useMonthlyStats = (year?: number) => {
  return useQuery({
    queryKey: ['admin', 'monthly-stats', year],
    queryFn: async () => {
      const url = year 
        ? `/api/v1/admin/monthly-stats?year=${year}`
        : '/api/v1/admin/monthly-stats';
      const response = await api.get<ApiResponse<MonthlyStatsResponse[]>>(url);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
