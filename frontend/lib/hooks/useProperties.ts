import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { PropertyFormData } from '../validation';

export interface Property {
  id: number;
  code: string;
  name: string;
  slug: string;
  description: string;
  area: string;
  address?: string;
  location?: string;
  locationId?: number;
  locationName?: string;
  propertyTypeId?: number;
  propertyTypeName?: string;
  priceWeekday: number;
  priceWeekend: number;
  bedroomCount: number;
  bathroomCount: number;
  bedCount?: number;
  standardGuests: number;
  maxGuests: number;
  bedConfig?: string;
  distanceToSea?: string;
  priceNote?: string;
  mapUrl?: string;
  facebookLink?: string;
  metaDescription?: string;
  status: 'ACTIVE' | 'INACTIVE';
  images: PropertyImage[];
  amenities: Amenity[];
  labels?: Label[]; // Labels like "Sát biển", "View biển"
  createdAt: string;
  updatedAt: string;
}

export interface PropertyImage {
  id: number;
  imageUrl: string;
  isThumbnail?: boolean;
}

export interface Amenity {
  id: number;
  name: string;
  icon?: string;
  category?: string;
}

export interface Label {
  id: number;
  name: string;
  color?: string;
  iconCode?: string;
}

export interface PropertyFilters {
  keyword?: string; // Search by name, address, code
  locationId?: number; // Filter by Location entity ID
  propertyTypeId?: number; // Filter by Property Type ID
  minGuests?: number;
  maxGuests?: number;
  minPrice?: number;
  maxPrice?: number;
  bedroomCount?: number;
  amenityIds?: number[];
  labelIds?: number[]; // Filter by label IDs (Sát biển, View biển...)
  sort?: 'price_asc' | 'price_desc' | 'newest'; // Sort option
  page?: number;
  size?: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

/**
 * Hook to fetch paginated properties with filters
 */
export function useProperties(filters?: PropertyFilters) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters?.keyword) params.append('keyword', filters.keyword);
      if (filters?.locationId) params.append('locationId', filters.locationId.toString());
      if (filters?.propertyTypeId) params.append('propertyTypeId', filters.propertyTypeId.toString());
      if (filters?.minGuests) params.append('minGuests', filters.minGuests.toString());
      if (filters?.maxGuests) params.append('maxGuests', filters.maxGuests.toString());
      if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      if (filters?.bedroomCount) params.append('bedroomCount', filters.bedroomCount.toString());
      if (filters?.amenityIds?.length) {
        filters.amenityIds.forEach(id => params.append('amenityIds', id.toString()));
      }
      if (filters?.labelIds?.length) {
        filters.labelIds.forEach(id => params.append('labelIds', id.toString()));
      }
      if (filters?.sort) params.append('sort', filters.sort);
      if (filters?.page !== undefined) params.append('page', filters.page.toString());
      if (filters?.size) params.append('size', filters.size.toString());
      
      const url = `/api/v1/properties?${params.toString()}`;
      
      const response = await api.get<{ data: PageResponse<Property> }>(url);
      return response.data.data;
    },
  });
}

/**
 * Hook to fetch a single property by ID
 */
export function useProperty(id: number | string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const response = await api.get<{ data: Property }>(`/api/v1/properties/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

/**
 * Hook to create a new property
 */
export function useCreateProperty() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: PropertyFormData) => {
      // Transform data to match backend DTO format
      // Remove location field to avoid Enum deserialization error
      const { location, ...restData } = data;

      const payload = {
        ...restData,
        priceWeekday: data.priceWeekday,
        priceWeekend: data.priceWeekend,
        amenityIds: data.amenityIds || [],
        labelIds: data.labelIds || [], // Include labels
        images: data.images || [],
      };
      
      const response = await api.post<{ data: Property }>('/api/v1/properties', payload);
      return response.data.data;
    },
    onSuccess: async () => {
      // Use refetchQueries for faster UI updates
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['properties'] }),
        queryClient.refetchQueries({ queryKey: ['admin-properties'] }),
      ]);
    },
  });
}

/**
 * Hook to update an existing property
 */
export function useUpdateProperty() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: PropertyFormData }) => {
      // Transform data to match backend DTO format
      // Remove location field to avoid Enum deserialization error
      // Remove images field because images are handled by separate upload/delete APIs (for Update)
      // and sending strings (URLs) causes type mismatch with PropertyImageDTO (for Create/Update)
      const { location, images, ...restData } = data;

      const payload = {
        ...restData,
        priceWeekday: data.priceWeekday,
        priceWeekend: data.priceWeekend,
        amenityIds: data.amenityIds || [],
        labelIds: data.labelIds || [], // Include labels
      };
      
      const response = await api.put<{ data: Property }>(`/api/v1/properties/${id}`, payload);
      return response.data.data;
    },
    onSuccess: async (_, variables) => {
      // Use refetchQueries instead of invalidateQueries for faster UI updates
      // This immediately refetches the data rather than marking as stale
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['properties'] }),
        queryClient.refetchQueries({ queryKey: ['property', variables.id] }),
        queryClient.refetchQueries({ queryKey: ['property', String(variables.id)] }),
        queryClient.refetchQueries({ queryKey: ['admin-properties'] }),
      ]);
    },
  });
}

/**
 * Hook to delete a property
 */
export function useDeleteProperty() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/v1/properties/${id}`);
    },
    onSuccess: async () => {
      // Use refetchQueries for faster UI updates
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['properties'] }),
        queryClient.refetchQueries({ queryKey: ['admin-properties'] }),
      ]);
    },
  });
}
