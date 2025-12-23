'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';
import { PropertyFilters as PropertyFiltersType } from '@/lib/hooks/useProperties';
import { Amenity, Label as LabelType } from '@/lib/hooks/useProperties';
import { PropertyType } from '@/lib/hooks/useLocationsAndTypes';
import { useTranslations } from 'next-intl';

interface PropertyFiltersProps {
  filters: PropertyFiltersType;
  onFilterChange: (filters: PropertyFiltersType) => void;
  amenities: Amenity[];
  labels?: LabelType[]; // Labels for filtering (Sát biển, View biển...)
  propertyTypes?: PropertyType[];
  onClearFilters: () => void;
}

export function PropertyFilters({ 
  filters, 
  onFilterChange, 
  amenities,
  labels = [],
  propertyTypes = [],
  onClearFilters 
}: PropertyFiltersProps) {
  const t = useTranslations('common');
  // Local state for debounced inputs
  const [localKeyword, setLocalKeyword] = useState(filters.keyword || '');
  const [localMinPrice, setLocalMinPrice] = useState(filters.minPrice?.toString() || '');
  const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice?.toString() || '');
  const [localMinGuests, setLocalMinGuests] = useState(filters.minGuests?.toString() || '');
  const [localMaxGuests, setLocalMaxGuests] = useState(filters.maxGuests?.toString() || '');

  // Debounce price inputs (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      const minPrice = localMinPrice ? parseInt(localMinPrice, 10) : undefined;
      const maxPrice = localMaxPrice ? parseInt(localMaxPrice, 10) : undefined;
      
      if (minPrice !== filters.minPrice || maxPrice !== filters.maxPrice) {
        onFilterChange({
          ...filters,
          minPrice,
          maxPrice,
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localMinPrice, localMaxPrice]);

  // Debounce keyword input (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      const keyword = localKeyword.trim() || undefined;
      
      if (keyword !== filters.keyword) {
        onFilterChange({
          ...filters,
          keyword,
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localKeyword]);

  // Debounce guest count inputs (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      const minGuests = localMinGuests ? parseInt(localMinGuests, 10) : undefined;
      const maxGuests = localMaxGuests ? parseInt(localMaxGuests, 10) : undefined;
      
      if (minGuests !== filters.minGuests || maxGuests !== filters.maxGuests) {
        onFilterChange({
          ...filters,
          minGuests,
          maxGuests,
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localMinGuests, localMaxGuests]);

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
    onClearFilters();
  };

  const handleSortChange = (value: string) => {
    onFilterChange({
      ...filters,
      sort: value === 'default' ? undefined : value as 'price_asc' | 'price_desc' | 'newest',
    });
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
        {/* Label Filter (Sát biển, View biển...) - Đặc điểm nổi bật lên đầu */}
        {labels.length > 0 && (
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Đặc điểm nổi bật
            </Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {labels.map((label) => (
                <label
                  key={label.id}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={filters.labelIds?.includes(label.id) || false}
                    onChange={() => handleLabelToggle(label.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span 
                    className="text-xs px-2 py-0.5 rounded text-white font-medium"
                    style={{ backgroundColor: label.color || '#0EA5E9' }}
                  >
                    {label.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

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
          </Label>
          <Input
            id="keyword"
            type="text"
            placeholder="Tên villa, địa chỉ..."
            value={localKeyword}
            onChange={(e) => setLocalKeyword(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Location Filter */}
        <div>
          <Label htmlFor="location" className="text-sm font-medium mb-2 block">
            {t('location')}
          </Label>
          <Select
            value={filters.locationId?.toString() || 'all'}
            onValueChange={handleLocationChange}
          >
            <SelectTrigger id="location">
              <SelectValue placeholder={t('selectLocation')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="1">Bãi Sau</SelectItem>
              <SelectItem value="2">Bãi Trước</SelectItem>
              <SelectItem value="3">Long Cung</SelectItem>
              <SelectItem value="4">Bãi Dâu</SelectItem>
              <SelectItem value="5">Trung Tâm</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Property Type Filter */}
        {propertyTypes && propertyTypes.length > 0 && (
          <div>
            <Label htmlFor="propertyType" className="text-sm font-medium mb-2 block">
              {t('propertyType')}
            </Label>
            <Select
              value={filters.propertyTypeId?.toString() || 'all'}
              onValueChange={handlePropertyTypeChange}
            >
              <SelectTrigger id="propertyType">
                <SelectValue placeholder={t('selectType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Guest Count Filter */}
        <div>
          <Label className="text-sm font-medium mb-2 block">
            {t('guestCount')}
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

        {/* Price Range Filter */}
        <div>
          <Label className="text-sm font-medium mb-2 block">
            {t('pricePerNight')}
          </Label>
          <div className="space-y-2">
            <Input
              type="number"
              min="0"
              step="100000"
              placeholder={t('minPrice')}
              value={localMinPrice}
              onChange={(e) => setLocalMinPrice(e.target.value)}
            />
            <Input
              type="number"
              min="0"
              step="100000"
              placeholder={t('maxPrice')}
              value={localMaxPrice}
              onChange={(e) => setLocalMaxPrice(e.target.value)}
            />
          </div>
        </div>

        {/* Bedroom Count Filter */}
        <div>
          <Label htmlFor="bedrooms" className="text-sm font-medium mb-2 block">
            {t('bedroomCount')}
          </Label>
          <Select
            value={filters.bedroomCount?.toString() || 'all'}
            onValueChange={handleBedroomChange}
          >
            <SelectTrigger id="bedrooms">
              <SelectValue placeholder={t('selectBedrooms')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all')}</SelectItem>
              <SelectItem value="1">1 {t('rooms')}</SelectItem>
              <SelectItem value="2">2 {t('rooms')}</SelectItem>
              <SelectItem value="3">3 {t('rooms')}</SelectItem>
              <SelectItem value="4">4 {t('rooms')}</SelectItem>
              <SelectItem value="5">5+ {t('rooms')}</SelectItem>
            </SelectContent>
          </Select>
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
