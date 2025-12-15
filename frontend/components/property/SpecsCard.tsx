'use client';

import { Bed, Bath, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface SpecsCardProps {
  bedroomCount: number;
  bathroomCount: number;
  standardGuests: number;
  maxGuests: number;
  bedCount?: number;
}

export function SpecsCard({
  bedroomCount,
  bathroomCount,
  standardGuests,
  maxGuests,
  bedCount,
}: SpecsCardProps) {
  const t = useTranslations('common');

  const specs = [
    {
      icon: Bed,
      value: bedroomCount,
      label: t('beds'),
      key: 'bedrooms',
    },
    {
      icon: Bath,
      value: bathroomCount,
      label: t('baths'),
      key: 'bathrooms',
    },
    {
      icon: Users,
      value: `${standardGuests}-${maxGuests}`,
      label: t('guests'),
      key: 'guests',
    },
  ];

  // Add bed count if provided
  if (bedCount !== undefined && bedCount > 0) {
    specs.push({
      icon: Bed,
      value: bedCount,
      label: t('beds'),
      key: 'beds',
    });
  }

  return (
    <div className="bg-white rounded-xl shadow-warm-md hover:shadow-warm-lg transition-shadow duration-300 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-around gap-6 sm:gap-4">
        {specs.map((spec, index) => {
          const Icon = spec.icon;
          return (
            <div key={spec.key} className="flex items-center sm:flex-col sm:text-center gap-3 sm:gap-2">
              {/* Icon */}
              <div className="flex-shrink-0">
                <Icon 
                  className="h-6 w-6 text-[var(--ocean-blue-600)]" 
                  strokeWidth={2}
                />
              </div>
              
              {/* Number and Label */}
              <div className="flex flex-col sm:items-center">
                <span className="text-2xl font-bold text-[var(--navy-slate-900)]">
                  {spec.value}
                </span>
                <span className="text-sm text-[var(--navy-slate-600)]">
                  {spec.label}
                </span>
              </div>

              {/* Vertical Divider - Hidden on mobile, shown on desktop, not after last item */}
              {index < specs.length - 1 && (
                <div className="hidden sm:block h-12 w-px bg-[var(--navy-slate-200)] ml-4" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
