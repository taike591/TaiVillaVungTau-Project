'use client';

import { PropertyFilters as PropertyFiltersType } from '@/lib/hooks/useProperties';
import { PropertyType, Location } from '@/lib/hooks/useLocationsAndTypes';
import { Label as LabelType } from '@/lib/hooks/useProperties';
import { cn } from '@/lib/utils';

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
}

export function QuickFilters({
  filters,
  onFilterChange,
  locations,
  propertyTypes,
  labels,
  propertyCounts,
}: QuickFiltersProps) {
  const handleLocationChange = (locationId: number | undefined) => {
    onFilterChange({
      ...filters,
      locationId,
    });
  };

  const handlePropertyTypeChange = (propertyTypeId: number | undefined) => {
    onFilterChange({
      ...filters,
      propertyTypeId,
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

  // Calculate counts - use provided counts or show nothing
  const totalCount = propertyCounts?.total || 0;
  const getLocationCount = (id: number) => propertyCounts?.byLocation[id] || 0;
  const getPropertyTypeCount = (id: number) => propertyCounts?.byPropertyType[id] || 0;
  const getLabelCount = (id: number) => propertyCounts?.byLabel[id] || 0;

  const hasActiveLabels = filters.labelIds && filters.labelIds.length > 0;

  return (
    <div 
      className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 mb-6 border border-slate-200"
      style={{
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px -8px rgba(0,0,0,0.08)',
      }}
    >
      {/* Location Filter */}
      {locations.length > 0 && (
        <div className="mb-6">
          <span className="text-sm text-[#0c4a6e]/70 font-medium block mb-3">Vị trí</span>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {/* All Button */}
            <button
              onClick={() => handleLocationChange(undefined)}
              className={cn(
                "px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-sm font-medium transition-all duration-300",
                "border-2 hover:shadow-md hover:-translate-y-0.5",
                !filters.locationId 
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-transparent shadow-lg shadow-amber-500/25" 
                  : "bg-white text-[#0c4a6e] border-[#0c4a6e]/20 hover:border-amber-400"
              )}
            >
              <span className="flex items-center gap-2">
                Tất cả
                {propertyCounts && (
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-bold",
                    !filters.locationId 
                      ? "bg-white/20 text-white" 
                      : "bg-[#0c4a6e]/10 text-[#0c4a6e]"
                  )}>
                    {totalCount}
                  </span>
                )}
              </span>
            </button>
            
            {/* Location Chips */}
            {locations.map((location) => {
              const isActive = filters.locationId === location.id;
              return (
                <button
                  key={location.id}
                  onClick={() => handleLocationChange(location.id)}
                  className={cn(
                    "px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-sm font-medium transition-all duration-300",
                    "border-2 hover:shadow-md hover:-translate-y-0.5",
                    isActive 
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-transparent shadow-lg shadow-amber-500/25" 
                      : "bg-white text-[#0c4a6e] border-[#0c4a6e]/20 hover:border-amber-400"
                  )}
                >
                  <span className="flex items-center gap-2">
                    {location.name}
                    {propertyCounts && (
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-bold",
                        isActive 
                          ? "bg-white/20 text-white" 
                          : "bg-[#0c4a6e]/10 text-[#0c4a6e]"
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
        <div className="mb-6">
          <span className="text-sm text-[#0c4a6e]/70 font-medium block mb-3">Loại hình:</span>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {/* All Button */}
            <button
              onClick={() => handlePropertyTypeChange(undefined)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                !filters.propertyTypeId
                  ? "bg-amber-500 text-white shadow-md shadow-amber-500/25"
                  : "bg-white/80 text-[#0c4a6e] hover:bg-white border border-[#0c4a6e]/10"
              )}
            >
              Tất cả
              {propertyCounts && (
                <span className={cn(
                  "ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold",
                  !filters.propertyTypeId
                    ? "bg-white/20 text-white"
                    : "bg-[#0c4a6e]/10 text-[#0c4a6e]"
                )}>
                  {totalCount}
                </span>
              )}
            </button>
            
            {/* Property Type Chips */}
            {propertyTypes.map((type) => {
              const isActive = filters.propertyTypeId === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => handlePropertyTypeChange(type.id)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-amber-500 text-white shadow-md shadow-amber-500/25"
                      : "bg-white/80 text-[#0c4a6e] hover:bg-white border border-[#0c4a6e]/10"
                  )}
                >
                  {type.name}
                  {propertyCounts && (
                    <span className={cn(
                      "ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-[#0c4a6e]/10 text-[#0c4a6e]"
                    )}>
                      {getPropertyTypeCount(type.id)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Labels/Features Filter */}
      {labels.length > 0 && (
        <div>
          <span className="text-sm text-[#0c4a6e]/70 font-medium block mb-3">Đặc điểm:</span>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {labels.map((label) => {
              const isActive = filters.labelIds?.includes(label.id) || false;
              return (
                <button
                  key={label.id}
                  onClick={() => handleLabelToggle(label.id)}
                  className={cn(
                    "px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 border-2",
                    isActive
                      ? "text-white shadow-md scale-105"
                      : "bg-white/80 hover:bg-white text-[#0c4a6e]"
                  )}
                  style={{
                    backgroundColor: isActive ? (label.color || '#0EA5E9') : undefined,
                    borderColor: isActive ? (label.color || '#0EA5E9') : `${label.color || '#0EA5E9'}40`,
                    boxShadow: isActive ? `0 4px 12px ${label.color || '#0EA5E9'}40` : undefined,
                  }}
                >
                  <span className="flex items-center gap-1 sm:gap-1.5">
                    {!isActive && (
                      <span 
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                        style={{ backgroundColor: label.color || '#0EA5E9' }}
                      />
                    )}
                    {label.name}
                    {propertyCounts && (
                      <span className={cn(
                        "px-1 sm:px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-[#0c4a6e]/10 text-[#0c4a6e]"
                      )}>
                        {getLabelCount(label.id)}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
            
            {/* Clear Labels Button */}
            {hasActiveLabels && (
              <button
                onClick={() => onFilterChange({ ...filters, labelIds: undefined })}
                className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200"
              >
                ✕ Xóa lọc
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
