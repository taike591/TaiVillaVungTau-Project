import { useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { PropertyFilters } from './useProperties';

/**
 * Hook to manage property filters using URL search params
 * This ensures filters are shareable and SEO-friendly
 */
export function useFilters() {
  const searchParams = useSearchParams();
  
  /**
   * Get current filters from URL
   */
  const getFilters = useCallback((): PropertyFilters => {
    const filters: PropertyFilters = {};
    
    const locationId = searchParams.get('locationId');
    if (locationId) filters.locationId = parseInt(locationId, 10);
    
    const minGuests = searchParams.get('minGuests');
    if (minGuests) filters.minGuests = parseInt(minGuests, 10);
    
    const maxGuests = searchParams.get('maxGuests');
    if (maxGuests) filters.maxGuests = parseInt(maxGuests, 10);
    
    const minPrice = searchParams.get('minPrice');
    if (minPrice) filters.minPrice = parseInt(minPrice, 10);
    
    const maxPrice = searchParams.get('maxPrice');
    if (maxPrice) filters.maxPrice = parseInt(maxPrice, 10);
    
    const bedroomCount = searchParams.get('bedroomCount');
    if (bedroomCount) filters.bedroomCount = parseInt(bedroomCount, 10);
    
    const amenityIds = searchParams.getAll('amenityIds');
    if (amenityIds.length > 0) {
      filters.amenityIds = amenityIds.map(id => parseInt(id, 10));
    }
    
    const page = searchParams.get('page');
    if (page) filters.page = parseInt(page, 10);
    
    const size = searchParams.get('size');
    if (size) filters.size = parseInt(size, 10);
    
    return filters;
  }, [searchParams]);
  
  /**
   * Update filters in URL
   */
  const setFilters = useCallback((filters: PropertyFilters) => {
    const params = new URLSearchParams();
    
    if (filters.locationId) params.set('locationId', filters.locationId.toString());
    if (filters.minGuests) params.set('minGuests', filters.minGuests.toString());
    if (filters.maxGuests) params.set('maxGuests', filters.maxGuests.toString());
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.bedroomCount) params.set('bedroomCount', filters.bedroomCount.toString());
    if (filters.amenityIds?.length) {
      filters.amenityIds.forEach(id => params.append('amenityIds', id.toString()));
    }
    if (filters.page !== undefined) params.set('page', filters.page.toString());
    if (filters.size) params.set('size', filters.size.toString());
    
    // Update URL without page reload
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
  }, []);
  
  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    window.history.pushState({}, '', window.location.pathname);
  }, []);
  
  /**
   * Update a single filter
   */
  const updateFilter = useCallback((key: keyof PropertyFilters, value: any) => {
    const currentFilters = getFilters();
    const newFilters = { ...currentFilters, [key]: value };
    
    // Remove undefined values
    Object.keys(newFilters).forEach(k => {
      if (newFilters[k as keyof PropertyFilters] === undefined) {
        delete newFilters[k as keyof PropertyFilters];
      }
    });
    
    setFilters(newFilters);
  }, [getFilters, setFilters]);
  
  return {
    filters: getFilters(),
    setFilters,
    clearFilters,
    updateFilter,
  };
}
