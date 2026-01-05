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
  poolArea?: string;
  distanceToSea?: string;
  priceNote?: string;
  mapUrl?: string;
  facebookLink?: string;
  metaDescription?: string;
  googleSheetsUrl?: string;
  googleSheetsNote?: string;
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
  bathroomCount?: number;
  bedCount?: number;
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
      if (filters?.bedroomCount) params.append('minBedroom', filters.bedroomCount.toString());
      if (filters?.bathroomCount) params.append('minBathroom', filters.bathroomCount.toString());
      if (filters?.bedCount) params.append('minBedCount', filters.bedCount.toString());
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
 * Helper function to upload a single image to Cloudinary
 * Returns null if upload fails (for filtering later)
 */
async function uploadSingleImage(image: File | string | { imageUrl: string; isThumbnail?: boolean }, index: number): Promise<{ imageUrl: string; isThumbnail: boolean } | null> {
  try {
    if (image instanceof File) {
      const formData = new FormData();
      formData.append('file', image);
      
      const uploadResponse = await api.post<{ data: string }>('/api/v1/images/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      return {
        imageUrl: uploadResponse.data.data,
        isThumbnail: index === 0,
      };
    } else if (typeof image === 'string') {
      return {
        imageUrl: image,
        isThumbnail: index === 0,
      };
    } else if (image && typeof image === 'object' && 'imageUrl' in image) {
      return {
        imageUrl: image.imageUrl,
        isThumbnail: image.isThumbnail ?? index === 0,
      };
    }
    return null;
  } catch (error) {
    console.error(`Failed to upload image at index ${index}:`, error);
    return null;
  }
}

/**
 * Hook to create a new property
 * Production-grade implementation:
 * - Parallel image uploads for speed
 * - Graceful error handling (partial failures don't break everything)
 * - At least 1 image required to proceed
 */
export function useCreateProperty() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: PropertyFormData) => {
      const { location, images, ...restData } = data;

      // Step 1: Upload images in parallel for speed
      let uploadedImages: { imageUrl: string; isThumbnail: boolean }[] = [];
      
      if (images && images.length > 0) {
        // Parallel uploads - much faster than sequential
        const uploadPromises = images.map((img, idx) => uploadSingleImage(img, idx));
        const results = await Promise.all(uploadPromises);
        
        // Filter out failed uploads (null values)
        uploadedImages = results.filter((img): img is { imageUrl: string; isThumbnail: boolean } => img !== null);
        
        // Require at least 1 successful image
        if (uploadedImages.length === 0 && images.length > 0) {
          throw new Error('Không thể upload ảnh. Vui lòng thử lại.');
        }
        
        // Warn if some uploads failed but continue
        if (uploadedImages.length < images.length) {
          console.warn(`Only ${uploadedImages.length}/${images.length} images uploaded successfully`);
        }
      }

      // Step 2: Create property with uploaded image URLs
      const payload = {
        ...restData,
        priceWeekday: data.priceWeekday,
        priceWeekend: data.priceWeekend,
        amenityIds: data.amenityIds || [],
        labelIds: data.labelIds || [],
        images: uploadedImages,
      };
      
      const response = await api.post<{ data: Property }>('/api/v1/properties', payload);
      return response.data.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['properties'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-properties'] }),
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
