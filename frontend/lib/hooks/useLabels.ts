import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';

export interface Label {
  id: number;
  name: string;
  color?: string;
  iconCode?: string;
}

export interface LabelFormData {
  name: string;
  color?: string;
  iconCode?: string;
}

/**
 * Hook to fetch all labels (public endpoint)
 */
export function useLabels() {
  return useQuery({
    queryKey: ['labels'],
    queryFn: async () => {
      const response = await api.get('/api/v1/labels');
      return response.data.data as Label[];
    },
  });
}

/**
 * Hook to create a new label (admin endpoint)
 */
export function useCreateLabel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: LabelFormData) => {
      const response = await api.post('/api/v1/labels', data);
      return response.data.data as Label;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['labels'] }),
        queryClient.refetchQueries({ queryKey: ['admin-labels'] }),
      ]);
    },
  });
}

/**
 * Hook to update an existing label (admin endpoint)
 */
export function useUpdateLabel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: LabelFormData }) => {
      const response = await api.put(`/api/v1/labels/${id}`, data);
      return response.data.data as Label;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['labels'] }),
        queryClient.refetchQueries({ queryKey: ['admin-labels'] }),
      ]);
    },
  });
}

/**
 * Hook to delete a label (admin endpoint)
 */
export function useDeleteLabel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/v1/labels/${id}`);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['labels'] }),
        queryClient.refetchQueries({ queryKey: ['admin-labels'] }),
      ]);
    },
  });
}
