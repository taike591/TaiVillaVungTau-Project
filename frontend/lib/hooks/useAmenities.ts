import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { AmenityFormData } from '../validation';
import type { Amenity } from './useProperties';

/**
 * Hook to fetch all amenities (public endpoint)
 */
export function useAmenities() {
  return useQuery({
    queryKey: ['amenities'],
    queryFn: async () => {
      const response = await api.get('/api/v1/amenities');
      return response.data.data as Amenity[];
    },
  });
}

/**
 * Hook to fetch a single amenity by ID
 */
export function useAmenity(id: number) {
  return useQuery({
    queryKey: ['amenity', id],
    queryFn: async () => {
      const response = await api.get(`/api/v1/amenities/${id}`);
      return response.data.data as Amenity;
    },
    enabled: !!id,
  });
}

/**
 * Hook to create a new amenity (admin endpoint)
 */
export function useCreateAmenity() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: AmenityFormData) => {
      const payload = {
        name: data.name,
        iconCode: data.icon || undefined,
      };
      const response = await api.post('/api/v1/amenities', payload);
      return response.data.data as Amenity;
    },
    onSuccess: async () => {
      // Use refetchQueries for faster UI updates
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['amenities'] }),
        queryClient.refetchQueries({ queryKey: ['admin-amenities'] }),
      ]);
    },
  });
}

/**
 * Hook to update an existing amenity (admin endpoint)
 * Note: Backend doesn't currently support update, this is a placeholder
 */
export function useUpdateAmenity() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: AmenityFormData }) => {
      // Backend doesn't have update endpoint yet
      throw new Error('Update endpoint not implemented in backend');
    },
    onSuccess: async (_, variables) => {
      // Use refetchQueries for faster UI updates
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['amenities'] }),
        queryClient.refetchQueries({ queryKey: ['admin-amenities'] }),
        queryClient.refetchQueries({ queryKey: ['amenity', variables.id] }),
      ]);
    },
  });
}

/**
 * Hook to delete an amenity (admin endpoint)
 */
export function useDeleteAmenity() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/v1/amenities/${id}`);
    },
    onSuccess: async () => {
      // Use refetchQueries for faster UI updates
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['amenities'] }),
        queryClient.refetchQueries({ queryKey: ['admin-amenities'] }),
      ]);
    },
  });
}
