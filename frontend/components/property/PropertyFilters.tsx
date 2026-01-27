'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { X, Loader2 } from 'lucide-react';
import { PropertyFilters as PropertyFiltersType } from '@/lib/hooks/useProperties';
import { Amenity, Label as LabelType } from '@/lib/hooks/useProperties';
import { PropertyType, Location } from '@/lib/hooks/useLocationsAndTypes';
import { useTranslations } from 'next-intl';

// Debounce delay constants
const DEBOUNCE_DELAY = 500; // 500ms for better UX
const KEYWORD_DEBOUNCE_DELAY = 600; // Slightly longer for keyword search

interface PropertyFiltersProps {
  filters: PropertyFiltersType;
  onFilterChange: (filters: PropertyFiltersType) => void;
  amenities: Amenity[];
  labels?: LabelType[]; // Labels for filtering (Sát biển, View biển...)
  propertyTypes?: PropertyType[];
  locations?: Location[]; // Dynamic locations from API
  onClearFilters: () => void;
}

export function PropertyFilters({ 
  filters, 
  onFilterChange, 
  amenities,
  labels = [],
  propertyTypes = [],
  locations = [],
  onClearFilters 
}: PropertyFiltersProps) {
  const t = useTranslations('common');
  // Local state for debounced inputs
  const [localKeyword, setLocalKeyword] = useState(filters.keyword || '');
  const [localMinPrice, setLocalMinPrice] = useState(filters.minPrice?.toString() || '');
  const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice?.toString() || '');
  const [localMinGuests, setLocalMinGuests] = useState(filters.minGuests?.toString() || '');
  const [localMaxGuests, setLocalMaxGuests] = useState(filters.maxGuests?.toString() || '');
  const [localBedrooms, setLocalBedrooms] = useState(filters.bedroomCount?.toString() || '');
  const [localBathrooms, setLocalBathrooms] = useState(filters.bathroomCount?.toString() || '');
  const [localBeds, setLocalBeds] = useState(filters.bedCount?.toString() || '');

  // Loading states for debounce indicators
  const [isKeywordDebouncing, setIsKeywordDebouncing] = useState(false);
  const [isPriceDebouncing, setIsPriceDebouncing] = useState(false);
  const [isGuestDebouncing, setIsGuestDebouncing] = useState(false);
  const [isRoomDebouncing, setIsRoomDebouncing] = useState(false);

  // Ref to track when we're syncing from props (to prevent debounce effects from firing)
  const isExternalSyncRef = useRef(false);

  // Sync local state with filters prop when filters change externally (e.g., after clear all)
  useEffect(() => {
    // Mark as external sync to prevent debounce effects
    isExternalSyncRef.current = true;
    
    setLocalKeyword(filters.keyword || '');
    setLocalMinPrice(filters.minPrice?.toString() || '');
    setLocalMaxPrice(filters.maxPrice?.toString() || '');
    setLocalMinGuests(filters.minGuests?.toString() || '');
    setLocalMaxGuests(filters.maxGuests?.toString() || '');
    setLocalBedrooms(filters.bedroomCount?.toString() || '');
    setLocalBathrooms(filters.bathroomCount?.toString() || '');
    setLocalBeds(filters.bedCount?.toString() || '');
    
    // Reset the flag after a short delay (longer than debounce timeouts)
    const timer = setTimeout(() => {
      isExternalSyncRef.current = false;
    }, 400);
    
    return () => clearTimeout(timer);
  }, [
    filters.keyword,
    filters.minPrice,
    filters.maxPrice,
    filters.minGuests,
    filters.maxGuests,
    filters.bedroomCount,
    filters.bathroomCount,
    filters.bedCount,
  ]);

  // Debounce price inputs
  useEffect(() => {
    // Skip if we're syncing from external props
    if (isExternalSyncRef.current) return;
    
    // Show loading indicator
    if (localMinPrice || localMaxPrice) {
      setIsPriceDebouncing(true);
    }
    
    const timer = setTimeout(() => {
      setIsPriceDebouncing(false);
      const minPrice = localMinPrice ? parseInt(localMinPrice, 10) : undefined;
      const maxPrice = localMaxPrice ? parseInt(localMaxPrice, 10) : undefined;
      
      if (minPrice !== filters.minPrice || maxPrice !== filters.maxPrice) {
        onFilterChange({
          ...filters,
          minPrice,
          maxPrice,
        });
      }
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(timer);
      setIsPriceDebouncing(false);
    };
  }, [localMinPrice, localMaxPrice]);

  // Debounce keyword input
  useEffect(() => {
    // Skip if we're syncing from external props
    if (isExternalSyncRef.current) return;
    
    // Show loading indicator when typing
    if (localKeyword.trim()) {
      setIsKeywordDebouncing(true);
    }
    
    const timer = setTimeout(() => {
      setIsKeywordDebouncing(false);
      const keyword = localKeyword.trim() || undefined;
      
      if (keyword !== filters.keyword) {
        onFilterChange({
          ...filters,
          keyword,
        });
      }
    }, KEYWORD_DEBOUNCE_DELAY);

    return () => {
      clearTimeout(timer);
      setIsKeywordDebouncing(false);
    };
  }, [localKeyword]);

  // Debounce guest count inputs
  useEffect(() => {
    // Skip if we're syncing from external props
    if (isExternalSyncRef.current) return;
    
    // Show loading indicator
    if (localMinGuests || localMaxGuests) {
      setIsGuestDebouncing(true);
    }
    
    const timer = setTimeout(() => {
      setIsGuestDebouncing(false);
      const minGuests = localMinGuests ? parseInt(localMinGuests, 10) : undefined;
      const maxGuests = localMaxGuests ? parseInt(localMaxGuests, 10) : undefined;
      
      if (minGuests !== filters.minGuests || maxGuests !== filters.maxGuests) {
        onFilterChange({
          ...filters,
          minGuests,
          maxGuests,
        });
      }
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(timer);
      setIsGuestDebouncing(false);
    };
  }, [localMinGuests, localMaxGuests]);

  // Debounce bedroom/bathroom/bed inputs
  useEffect(() => {
    // Skip if we're syncing from external props
    if (isExternalSyncRef.current) return;
    
    // Show loading indicator
    if (localBedrooms || localBathrooms || localBeds) {
      setIsRoomDebouncing(true);
    }
    
    const timer = setTimeout(() => {
      setIsRoomDebouncing(false);
      const bedroomCount = localBedrooms ? parseInt(localBedrooms, 10) : undefined;
      const bathroomCount = localBathrooms ? parseInt(localBathrooms, 10) : undefined;
      const bedCount = localBeds ? parseInt(localBeds, 10) : undefined;
      
      if (bedroomCount !== filters.bedroomCount || bathroomCount !== filters.bathroomCount || bedCount !== filters.bedCount) {
        onFilterChange({
          ...filters,
          bedroomCount,
          bathroomCount,
          bedCount,
        });
      }
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(timer);
      setIsRoomDebouncing(false);
    };
  }, [localBedrooms, localBathrooms, localBeds]);
  const handleLocationChange = (value: string) => {
    onFilterChange({
      ...filters,
      locationId: value === 'all' ? undefined : parseInt(value, 10),
    });
  };

  const handlePropertyTypeChange = (value: string) => {
    onFilterChange({
      ...filters,
      propertyTypeId: value === 'all' ? undefined : parseInt(value, 10),
    });
  };

  const handleBedroomChange = (value: string) => {
    onFilterChange({
      ...filters,
      bedroomCount: value === 'all' ? undefined : parseInt(value, 10),
    });
  };

  const handleBathroomChange = (value: string) => {
    onFilterChange({
      ...filters,
      bathroomCount: value === 'all' ? undefined : parseInt(value, 10),
    });
  };

  const handleAmenityToggle = (amenityId: number) => {
    const currentAmenities = filters.amenityIds || [];
    const newAmenities = currentAmenities.includes(amenityId)
      ? currentAmenities.filter(id => id !== amenityId)
      : [...currentAmenities, amenityId];
    
    onFilterChange({
      ...filters,
      amenityIds: newAmenities.length > 0 ? newAmenities : undefined,
    });
  };

  const handleLabelToggle = (labelId: number) => {
    const currentLabels = filters.labelIds || [];
    const newLabels = currentLabels.includes(labelId)
      ? currentLabels.filter(id => id !== labelId)
      : [...currentLabels, labelId];
    
    onFilterChange({
      ...filters,
      labelIds: newLabels.length > 0 ? newLabels : undefined,
    });
  };

  const handleClearAll = () => {
    setLocalKeyword('');
    setLocalMinPrice('');
    setLocalMaxPrice('');
    setLocalMinGuests('');
    setLocalMaxGuests('');
    setLocalBedrooms('');
    setLocalBathrooms('');
    setLocalBeds('');
    onClearFilters();
  };

  const handleSortChange = (value: string) => {
    onFilterChange({
      ...filters,
      sort: value === 'default' ? undefined : value as 'price_asc' | 'price_desc' | 'newest',
    });
  };

  // Get current price range value for dropdown
  const getPriceRangeValue = (): string => {
    if (!filters.minPrice && !filters.maxPrice) return 'all';
    if (filters.minPrice === 0 && filters.maxPrice === 3000000) return '0-3000000';
    if (filters.minPrice === 3000000 && filters.maxPrice === 5000000) return '3000000-5000000';
    if (filters.minPrice === 5000000 && filters.maxPrice === 10000000) return '5000000-10000000';
    if (filters.minPrice === 10000000 && filters.maxPrice === 15000000) return '10000000-15000000';
    if (filters.minPrice === 15000000 && filters.maxPrice === 20000000) return '15000000-20000000';
    if (filters.minPrice === 20000000 && !filters.maxPrice) return '20000000-';
    return 'all';
  };

  // Handle price range dropdown change
  const handlePriceRangeChange = (value: string) => {
    if (value === 'all') {
      onFilterChange({
        ...filters,
        minPrice: undefined,
        maxPrice: undefined,
      });
    } else {
      const [min, max] = value.split('-');
      onFilterChange({
        ...filters,
        minPrice: min ? parseInt(min, 10) : undefined,
        maxPrice: max ? parseInt(max, 10) : undefined,
      });
    }
  };

  const hasActiveFilters = 
    filters.keyword ||
    filters.locationId || 
    filters.propertyTypeId ||
    filters.minGuests || 
    filters.maxGuests || 
    filters.minPrice || 
    filters.maxPrice || 
    filters.bedroomCount || 
    filters.bathroomCount ||
    filters.bedCount ||
    filters.sort ||
    (filters.amenityIds && filters.amenityIds.length > 0) ||
    (filters.labelIds && filters.labelIds.length > 0);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Bộ Lọc Tìm Kiếm</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            {t('clearAll')}
          </Button>
        )}
      </div>

      <div className="space-y-4">

        {/* Sort Dropdown */}
        <div>
          <Label htmlFor="sort" className="text-sm font-medium mb-2 block">
            Sắp xếp theo
          </Label>
          <Select
            value={filters.sort || 'default'}
            onValueChange={handleSortChange}
          >
            <SelectTrigger id="sort">
              <SelectValue placeholder="Chọn cách sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Mặc định</SelectItem>
              <SelectItem value="price_asc">Giá: Thấp → Cao</SelectItem>
              <SelectItem value="price_desc">Giá: Cao → Thấp</SelectItem>
              <SelectItem value="newest">Mới nhất</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Keyword Search */}
        <div>
          <Label htmlFor="keyword" className="text-sm font-medium mb-2 block">
            Tìm kiếm
            {isKeywordDebouncing && (
              <Loader2 className="inline-block h-3 w-3 ml-2 animate-spin text-blue-500" />
            )}
          </Label>
          <div className="relative">
            <Input
              id="keyword"
              type="text"
              placeholder="Tên villa, địa chỉ..."
              value={localKeyword}
              onChange={(e) => setLocalKeyword(e.target.value)}
              className="w-full pr-8"
            />
            {isKeywordDebouncing && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              </div>
            )}
          </div>
        </div>


        {/* Guest Count Filter */}
        <div>
          <Label className="text-sm font-medium mb-2 block">
            {t('guestCount')}
            {isGuestDebouncing && (
              <Loader2 className="inline-block h-3 w-3 ml-2 animate-spin text-blue-500" />
            )}
          </Label>
          <div className="space-y-2">
            <Input
              type="number"
              min="1"
              placeholder={t('minGuests')}
              value={localMinGuests}
              onChange={(e) => setLocalMinGuests(e.target.value)}
            />
            <Input
              type="number"
              min="1"
              placeholder={t('maxGuests')}
              value={localMaxGuests}
              onChange={(e) => setLocalMaxGuests(e.target.value)}
            />
          </div>
        </div>

        {/* Price Range Filter - Dropdown */}
        <div>
          <Label htmlFor="priceRange" className="text-sm font-medium mb-2 block">
            {t('pricePerNight')}
          </Label>
          <Select
            value={getPriceRangeValue()}
            onValueChange={handlePriceRangeChange}
          >
            <SelectTrigger id="priceRange">
              <SelectValue placeholder="Chọn khoảng giá" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả mức giá</SelectItem>
              <SelectItem value="0-3000000">Dưới 3 triệu</SelectItem>
              <SelectItem value="3000000-5000000">3 - 5 triệu</SelectItem>
              <SelectItem value="5000000-10000000">5 - 10 triệu</SelectItem>
              <SelectItem value="10000000-15000000">10 - 15 triệu</SelectItem>
              <SelectItem value="15000000-20000000">15 - 20 triệu</SelectItem>
              <SelectItem value="20000000-">Trên 20 triệu</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bedroom Count Filter */}
        <div>
          <Label htmlFor="bedrooms" className="text-sm font-medium mb-2 block">
            {t('bedroomCount')}
            {isRoomDebouncing && (
              <Loader2 className="inline-block h-3 w-3 ml-2 animate-spin text-blue-500" />
            )}
          </Label>
          <Input
            id="bedrooms"
            type="number"
            min="1"
            placeholder="Tối thiểu"
            value={localBedrooms}
            onChange={(e) => setLocalBedrooms(e.target.value)}
          />
        </div>

        {/* Bed Count Filter */}
        <div>
          <Label htmlFor="beds" className="text-sm font-medium mb-2 block">
            Số giường
            {isRoomDebouncing && (
              <Loader2 className="inline-block h-3 w-3 ml-2 animate-spin text-blue-500" />
            )}
          </Label>
          <Input
            id="beds"
            type="number"
            min="1"
            placeholder="Tối thiểu"
            value={localBeds}
            onChange={(e) => setLocalBeds(e.target.value)}
          />
        </div>

        {/* Bathroom Count Filter */}
        <div>
          <Label htmlFor="bathrooms" className="text-sm font-medium mb-2 block">
            Số WC
          </Label>
          <Input
            id="bathrooms"
            type="number"
            min="1"
            placeholder="Tối thiểu"
            value={localBathrooms}
            onChange={(e) => setLocalBathrooms(e.target.value)}
          />
        </div>
        {/* Amenity Filter */}
        {amenities.length > 0 && (
          <div>
            <Label className="text-sm font-medium mb-2 block">
              {t('amenities')}
            </Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {amenities.map((amenity) => (
                <label
                  key={amenity.id}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={filters.amenityIds?.includes(amenity.id) || false}
                    onChange={() => handleAmenityToggle(amenity.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{amenity.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
