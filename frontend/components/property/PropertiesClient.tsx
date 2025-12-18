'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { PropertyCard } from '@/components/property-card';
import { PropertyFilters } from '@/components/property/PropertyFilters';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/ui/pagination';
import { PropertyCardSkeleton } from '@/components/shared/LoadingState';
import { useProperties } from '@/lib/hooks/useProperties';
import { useAmenities } from '@/lib/hooks/useAmenities';
import { usePropertyTypes } from '@/lib/hooks/useLocationsAndTypes';
import { PropertyFilters as PropertyFiltersType } from '@/lib/hooks/useProperties';

export function PropertiesClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Parse filters from URL
  const filters: PropertyFiltersType = {
    keyword: searchParams.get('keyword') || undefined,
    locationId: searchParams.get('locationId') ? parseInt(searchParams.get('locationId')!, 10) : undefined,
    propertyTypeId: searchParams.get('propertyTypeId') ? parseInt(searchParams.get('propertyTypeId')!, 10) : undefined,
    minGuests: searchParams.get('minGuests') ? parseInt(searchParams.get('minGuests')!, 10) : undefined,
    maxGuests: searchParams.get('maxGuests') ? parseInt(searchParams.get('maxGuests')!, 10) : undefined,
    minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!, 10) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!, 10) : undefined,
    bedroomCount: searchParams.get('bedroomCount') ? parseInt(searchParams.get('bedroomCount')!, 10) : undefined,
    amenityIds: searchParams.getAll('amenityIds').map(id => parseInt(id, 10)),
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 0,
    size: 12,
  };

  // Fetch properties, amenities, and property types
  const { data: propertiesData, isLoading: isLoadingProperties } = useProperties(filters);
  const { data: amenities = [], isLoading: isLoadingAmenities } = useAmenities();
  const { data: propertyTypes = [], isLoading: isLoadingPropertyTypes } = usePropertyTypes();

  const properties = propertiesData?.content || [];
  const totalPages = propertiesData?.totalPages || 0;
  const currentPage = filters.page || 0;

  // Scroll to top when page changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  // Update filters in URL
  const handleFilterChange = (newFilters: PropertyFiltersType) => {
    const params = new URLSearchParams();

    if (newFilters.keyword) params.set('keyword', newFilters.keyword);
    if (newFilters.locationId) params.set('locationId', newFilters.locationId.toString());
    if (newFilters.propertyTypeId) params.set('propertyTypeId', newFilters.propertyTypeId.toString());
    if (newFilters.minGuests) params.set('minGuests', newFilters.minGuests.toString());
    if (newFilters.maxGuests) params.set('maxGuests', newFilters.maxGuests.toString());
    if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice.toString());
    if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice.toString());
    if (newFilters.bedroomCount) params.set('bedroomCount', newFilters.bedroomCount.toString());
    if (newFilters.amenityIds?.length) {
      newFilters.amenityIds.forEach(id => params.append('amenityIds', id.toString()));
    }
    // Reset to page 0 when filters change
    params.set('page', '0');
    params.set('size', '12');

    router.push(`/properties?${params.toString()}`);
    // Close mobile filters after selection on mobile
    if (window.innerWidth < 1024) {
      setIsFiltersOpen(false);
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    router.push('/properties');
  };

  // Handle page change - maintains all existing filters
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-2">
        <Button 
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="w-full flex justify-between items-center bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 shadow-sm"
          variant="outline"
        >
          <span className="flex items-center gap-2 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sliders-horizontal"><line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/></svg>
            Bộ Lọc Tìm Kiếm
          </span>
          {isFiltersOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up"><path d="m18 15-6-6-6 6"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
          )}
        </Button>
      </div>

      {/* Sidebar Filters */}
      <aside className={`lg:w-64 shrink-0 transition-all duration-300 ease-in-out ${isFiltersOpen ? 'block' : 'hidden lg:block'}`}>
        <div className="sticky top-20">
          {isLoadingAmenities || isLoadingPropertyTypes ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <PropertyFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              amenities={amenities}
              propertyTypes={propertyTypes}
              onClearFilters={handleClearFilters}
            />
          )}
        </div>
      </aside>

      {/* Property Grid */}
      <div className="flex-1" ref={contentRef}>
        {isLoadingProperties ? (
          <div>
            <div className="mb-4 text-sm text-gray-500">Đang tải villa...</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PropertyCardSkeleton count={6} />
            </div>
          </div>
        ) : properties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 mb-4">
              Không tìm thấy villa phù hợp
            </p>
            <p className="text-sm text-gray-400 mb-4">
              Thử điều chỉnh bộ lọc hoặc tìm kiếm khác
            </p>
            <Button onClick={handleClearFilters} variant="outline">
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
