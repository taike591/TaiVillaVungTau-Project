'use client';

import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';

type PropertyStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

interface PropertyHeaderProps {
  code: string;
  name: string;
  status: PropertyStatus;
  locationName?: string;
  address: string;
}

export function PropertyHeader({
  code,
  name,
  status,
  locationName,
  address,
}: PropertyHeaderProps) {
  const t = useTranslations('status');
  
  const statusConfig = {
    ACTIVE: {
      label: t('active'),
      className: 'border-green-600 text-green-600 bg-green-50',
    },
    PENDING: {
      label: t('pending'),
      className: 'border-yellow-600 text-yellow-600 bg-yellow-50',
    },
    INACTIVE: {
      label: t('inactive'),
      className: 'border-gray-600 text-gray-600 bg-gray-50',
    },
  };
  
  const statusInfo = statusConfig[status];

  return (
    <header className="mb-6">
      {/* Badges Row */}
      <div className="flex items-center gap-2 mb-3">
        {/* Property Code Badge - Ocean Blue Styling */}
        <Badge className="bg-[var(--ocean-blue-600)] text-white border-transparent px-3 py-1 text-sm font-semibold">
          {code}
        </Badge>
        
        {/* Status Badge - Color Coded */}
        <Badge variant="outline" className={statusInfo.className}>
          {statusInfo.label}
        </Badge>
      </div>

      {/* Property Name - Lora Font, 48px on desktop, responsive on mobile */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold text-[var(--navy-slate-900)] mb-3 leading-tight">
        {name}
      </h1>

      {/* Location with MapPin Icon */}
      <div className="flex items-center text-[var(--navy-slate-600)] text-base md:text-lg">
        <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
        <span>
          {locationName && `${locationName} - `}
          {address}
        </span>
      </div>
    </header>
  );
}
