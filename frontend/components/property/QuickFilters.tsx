'use client';

import { PropertyFilters as PropertyFiltersType } from '@/lib/hooks/useProperties';
import { PropertyType, Location } from '@/lib/hooks/useLocationsAndTypes';
import { Label as LabelType } from '@/lib/hooks/useProperties';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Loader2, SlidersHorizontal } from 'lucide-react';

// Price range options (in VND)
const PRICE_RANGES = [
  { label: 'Tất cả', min: undefined, max: undefined },
  { label: 'Dưới 3 triệu', min: undefined, max: 3000000 },
  { label: '3 - 5 triệu', min: 3000000, max: 5000000 },
  { label: '5 - 8 triệu', min: 5000000, max: 8000000 },
  { label: '8 - 12 triệu', min: 8000000, max: 12000000 },
  { label: 'Trên 12 triệu', min: 12000000, max: undefined },
];

interface QuickFiltersProps {
  filters: PropertyFiltersType;
  onFilterChange: (filters: PropertyFiltersType) => void;
  locations: Location[];
  propertyTypes: PropertyType[];
  labels: LabelType[];
  propertyCounts?: {
    total: number;
    byLocation: Record<number, number>;
    byPropertyType: Record<number, number>;
    byLabel: Record<number, number>;
  };
  localKeyword?: string;
  onKeywordChange?: (value: string) => void;
  isSearching?: boolean;
  onSortChange?: (value: string) => void;
}

export function QuickFilters({
  filters,
  onFilterChange,
  locations,
  propertyTypes,
  labels,
  propertyCounts,
  localKeyword = '',
  onKeywordChange,
  isSearching = false,
  onSortChange,
}: QuickFiltersProps) {
  const handleLocationChange = (locationId: number | undefined) => {
    onFilterChange({ ...filters, locationId });
  };

  const handlePropertyTypeChange = (propertyTypeId: number | undefined) => {
    onFilterChange({ ...filters, propertyTypeId });
  };

  const handleLabelToggle = (labelId: number) => {
    const currentLabels = filters.labelIds || [];
    const newLabels = currentLabels.includes(labelId)
      ? currentLabels.filter(id => id !== labelId)
      : [...currentLabels, labelId];
    onFilterChange({ ...filters, labelIds: newLabels.length > 0 ? newLabels : undefined });
  };

  const handlePriceRangeChange = (min: number | undefined, max: number | undefined) => {
    onFilterChange({ ...filters, minPrice: min, maxPrice: max });
  };

  const getCurrentPriceRangeIndex = () => {
    const { minPrice, maxPrice } = filters;
    if (minPrice === undefined && maxPrice === undefined) return 0;
    return PRICE_RANGES.findIndex(range => range.min === minPrice && range.max === maxPrice);
  };

  const totalCount = propertyCounts?.total || 0;
  const getLocationCount = (id: number) => propertyCounts?.byLocation[id] || 0;
  const getPropertyTypeCount = (id: number) => propertyCounts?.byPropertyType[id] || 0;
  const getLabelCount = (id: number) => propertyCounts?.byLabel[id] || 0;

  const hasActiveLabels = filters.labelIds && filters.labelIds.length > 0;
  const currentPriceRangeIndex = getCurrentPriceRangeIndex();

  // Shared horizontal scroll container classes (hide scrollbar)
  const scrollContainerClass = "flex gap-2 overflow-x-auto pb-1 scrollbar-hide";

  return (
    <div 
      className="rounded-2xl p-4 sm:p-6 md:p-8 mb-6 border border-slate-200"
      style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 24px -4px rgba(0,0,0,0.06)',
      }}
    >
      {/* Search + Sort Row - Most important, always on top */}
      {onKeywordChange && (
        <div className="mb-5">
          <div className="flex gap-2 sm:gap-3">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <Input
                type="text"
                placeholder="Tìm villa theo tên, địa chỉ, mã..."
                value={localKeyword}
                onChange={(e) => onKeywordChange(e.target.value)}
                className="pl-9 pr-9 h-10 sm:h-11 rounded-xl border-slate-200 bg-white text-sm shadow-sm focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                </div>
              )}
            </div>

            {onSortChange && (
              <div className="w-[130px] sm:w-48 flex-shrink-0">
                <Select
                  value={filters.sort || 'default'}
                  onValueChange={onSortChange}
                >
                  <SelectTrigger className="h-10 sm:h-11 rounded-xl border-slate-200 bg-white shadow-sm text-sm">
                    <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-slate-400 flex-shrink-0" />
                    <SelectValue placeholder="Sắp xếp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Mặc định</SelectItem>
                    <SelectItem value="price_asc">Giá: Thấp → Cao</SelectItem>
                    <SelectItem value="price_desc">Giá: Cao → Thấp</SelectItem>
                    <SelectItem value="newest">Mới nhất</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Location Filter - Horizontal scroll on mobile */}
      {locations.length > 0 && (
        <div className="mb-4">
          <span className="text-xs sm:text-sm text-slate-500 font-medium block mb-2">Vị trí</span>
          <div className={scrollContainerClass}>
            <button
              onClick={() => handleLocationChange(undefined)}
              className={cn(
                "px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0",
                !filters.locationId
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300"
              )}
            >
              <span className="flex items-center gap-1.5">
                Tất cả
                {propertyCounts && (
                  <span className={cn(
                    "px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                    !filters.locationId ? "bg-white/25 text-white" : "bg-slate-200 text-slate-600"
                  )}>
                    {totalCount}
                  </span>
                )}
              </span>
            </button>
            
            {locations.map((location) => {
              const isActive = filters.locationId === location.id;
              return (
                <button
                  key={location.id}
                  onClick={() => handleLocationChange(location.id)}
                  className={cn(
                    "px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0",
                    isActive
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    {location.name}
                    {propertyCounts && (
                      <span className={cn(
                        "px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                        isActive ? "bg-white/25 text-white" : "bg-slate-200 text-slate-600"
                      )}>
                        {getLocationCount(location.id)}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Property Type Filter */}
      {propertyTypes.length > 0 && (
        <div className="mb-4">
          <span className="text-xs sm:text-sm text-slate-500 font-medium block mb-2">Loại hình</span>
          <div className={scrollContainerClass}>
            <button
              onClick={() => handlePropertyTypeChange(undefined)}
              className={cn(
                "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0",
                !filters.propertyTypeId
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              )}
            >
              Tất cả
            </button>
            
            {propertyTypes.map((type) => {
              const isActive = filters.propertyTypeId === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => handlePropertyTypeChange(type.id)}
                  className={cn(
                    "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0",
                    isActive
                      ? "bg-amber-500 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  )}
                >
                  {type.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Labels/Features Filter */}
      {labels.length > 0 && (
        <div className="mb-4">
          <span className="text-xs sm:text-sm text-slate-500 font-medium block mb-2">Đặc điểm</span>
            <div className={cn(scrollContainerClass, "items-center")}>
              {labels.map((label) => {
                const isActive = filters.labelIds?.includes(label.id) || false;
                return (
                  <button
                    key={label.id}
                    onClick={() => handleLabelToggle(label.id)}
                    className={cn(
                      "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 border",
                      isActive
                        ? "text-white shadow-sm"
                        : "bg-white text-slate-700 hover:bg-slate-50"
                    )}
                    style={{
                      backgroundColor: isActive ? (label.color || '#0EA5E9') : undefined,
                      borderColor: isActive ? (label.color || '#0EA5E9') : `${label.color || '#0EA5E9'}30`,
                    }}
                  >
                    <span className="flex items-center gap-1.5">
                      {!isActive && (
                        <span 
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: label.color || '#0EA5E9' }}
                        />
                      )}
                      {label.name}
                    </span>
                  </button>
                );
              })}
              
              {hasActiveLabels && (
                <button
                  onClick={() => onFilterChange({ ...filters, labelIds: undefined })}
                  className="px-2.5 py-1.5 rounded-full text-[10px] sm:text-xs font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all whitespace-nowrap flex-shrink-0"
                >
                  ✕ Xóa
                </button>
              )}
            </div>
          </div>
        )}

      {/* Price Range Filter - Horizontal scroll */}
      <div>
        <span className="text-xs sm:text-sm text-slate-500 font-medium block mb-2">Khoảng giá</span>
        <div className={scrollContainerClass}>
          {PRICE_RANGES.map((range, index) => {
            const isActive = currentPriceRangeIndex === index;
            return (
              <button
                key={index}
                onClick={() => handlePriceRangeChange(range.min, range.max)}
                className={cn(
                  "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0",
                  isActive
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm shadow-emerald-500/20"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                )}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
