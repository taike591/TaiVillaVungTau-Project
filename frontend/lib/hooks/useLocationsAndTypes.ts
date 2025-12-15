'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { LocationFormData, PropertyTypeFormData } from '../validation';

export interface Location {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface PropertyType {
  id: number;
  name: string;
  slug: string;
  iconCode?: string;
}

// --- Locations Hooks ---

/**
 * Hook to fetch all locations
 */
export function useLocations() {
  return useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const response = await api.get<{ data: Location[] }>('/api/v1/locations');
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch a single location by ID
 */
export function useLocation(id: string) {
  return useQuery({
    queryKey: ['locations', id],
    queryFn: async () => {
      const response = await api.get<{ data: Location }>(`/api/v1/locations/${id}`);
      return response.data.data;
    },
    enabled: !!id && id !== 'new',
  });
}

/**
 * Hook to create a new location
 */
export function useCreateLocation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: LocationFormData) => {
      const response = await api.post<{ data: Location }>('/api/v1/locations', data);
      return response.data.data;
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['locations'] });
    },
  });
}

/**
 * Hook to update an existing location
 */
export function useUpdateLocation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: LocationFormData }) => {
      const response = await api.put<{ data: Location }>(`/api/v1/locations/${id}`, data);
      return response.data.data;
    },
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['locations'] }),
        queryClient.refetchQueries({ queryKey: ['locations', data.id.toString()] }),
      ]);
    },
  });
}

/**
 * Hook to delete a location
 */
export function useDeleteLocation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/v1/locations/${id}`);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['locations'] });
    },
  });
}

// --- Property Types Hooks ---

/**
 * Hook to fetch all property types
 */
export function usePropertyTypes() {
  return useQuery({
    queryKey: ['propertyTypes'],
    queryFn: async () => {
      const response = await api.get<{ data: PropertyType[] }>('/api/v1/property-types');
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch a single property type by ID
 */
export function usePropertyType(id: string) {
  return useQuery({
    queryKey: ['propertyTypes', id],
    queryFn: async () => {
      const response = await api.get<{ data: PropertyType }>(`/api/v1/property-types/${id}`);
      return response.data.data;
    },
    enabled: !!id && id !== 'new',
  });
}

/**
 * Hook to create a new property type
 */
export function useCreatePropertyType() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: PropertyTypeFormData) => {
      const response = await api.post<{ data: PropertyType }>('/api/v1/property-types', data);
      return response.data.data;
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['propertyTypes'] });
    },
  });
}

/**
 * Hook to update an existing property type
 */
export function useUpdatePropertyType() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: PropertyTypeFormData }) => {
      const response = await api.put<{ data: PropertyType }>(`/api/v1/property-types/${id}`, data);
      return response.data.data;
    },
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['propertyTypes'] }),
        queryClient.refetchQueries({ queryKey: ['propertyTypes', data.id.toString()] }),
      ]);
    },
  });
}

/**
 * Hook to delete a property type
 */
export function useDeletePropertyType() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/v1/property-types/${id}`);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['propertyTypes'] });
    },
  });
}
