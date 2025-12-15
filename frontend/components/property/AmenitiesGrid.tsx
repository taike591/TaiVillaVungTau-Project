'use client';

import { CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Amenity {
  id: number;
  name: string;
  icon?: string;
  category?: string;
}

interface AmenitiesGridProps {
  amenities: Amenity[];
}

export function AmenitiesGrid({ amenities }: AmenitiesGridProps) {
  if (!amenities || amenities.length === 0) {
    return null;
  }

  const t = useTranslations('propertyDetail');

  // Group amenities by category if available
  const groupedAmenities = amenities.reduce((acc, amenity) => {
    const category = amenity.category || t('amenities');
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(amenity);
    return acc;
  }, {} as Record<string, Amenity[]>);

  const categories = Object.keys(groupedAmenities);
  const hasCategories = categories.length > 1 || (categories.length === 1 && categories[0] !== t('amenities'));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[var(--navy-slate-900)]">
        {t('amenities')}
      </h2>
      
      <div className="bg-white rounded-xl shadow-warm-md p-8">
        {hasCategories ? (
          // Render with categories
          <div className="space-y-8">
            {categories.map((category, categoryIndex) => (
              <div key={category}>
                {/* Category header */}
                <h3 className="text-base font-semibold text-[var(--ocean-blue-600)] mb-4">
                  {category}
                </h3>
                
                {/* Amenities grid for this category */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedAmenities[category].map((amenity) => (
                    <div
                      key={amenity.id}
                      className="flex items-center gap-3 group cursor-default transition-colors duration-200 hover:text-[var(--ocean-blue-600)]"
                    >
                      <CheckCircle2 
                        className="h-5 w-5 text-[var(--teal-water-500)] flex-shrink-0 group-hover:text-[var(--ocean-blue-600)] transition-colors duration-200" 
                        strokeWidth={2}
                      />
                      <span className="text-[15px] text-[var(--navy-slate-700)] group-hover:text-[var(--ocean-blue-600)] transition-colors duration-200">
                        {amenity.name}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Divider between categories (except last) */}
                {categoryIndex < categories.length - 1 && (
                  <div className="mt-8 border-t border-[var(--navy-slate-200)]" />
                )}
              </div>
            ))}
          </div>
        ) : (
          // Render without categories
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {amenities.map((amenity) => (
              <div
                key={amenity.id}
                className="flex items-center gap-3 group cursor-default transition-colors duration-200 hover:text-[var(--ocean-blue-600)]"
              >
                <CheckCircle2 
                  className="h-5 w-5 text-[var(--teal-water-500)] flex-shrink-0 group-hover:text-[var(--ocean-blue-600)] transition-colors duration-200" 
                  strokeWidth={2}
                />
                <span className="text-[15px] text-[var(--navy-slate-700)] group-hover:text-[var(--ocean-blue-600)] transition-colors duration-200">
                  {amenity.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
