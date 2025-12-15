'use client';

import { MapPin, Waves } from 'lucide-react';

interface LocationMapProps {
  mapUrl?: string;
  address: string;
  locationName?: string;
  distanceToSea?: string;
}

export function LocationMap({ 
  mapUrl, 
  address, 
  locationName, 
  distanceToSea 
}: LocationMapProps) {
  return (
    <div className="bg-white rounded-xl shadow-warm-lg p-8">
      {/* Section Title */}
      <h2 className="text-2xl font-semibold text-[var(--ocean-blue-600)] mb-6">
        Vị trí
      </h2>

      {/* Map or Fallback */}
      <div className="relative rounded-xl overflow-hidden mb-6">
        {mapUrl ? (
          <iframe
            src={mapUrl}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
            title="Property location map"
          />
        ) : (
          <div className="w-full h-[400px] bg-gradient-to-br from-[var(--ocean-blue-100)] to-[var(--teal-water-100)] flex items-center justify-center rounded-xl">
            <div className="text-center p-8">
              <MapPin className="w-16 h-16 text-[var(--ocean-blue-500)] mx-auto mb-4" />
              <p className="text-lg font-semibold text-[var(--navy-slate-900)] mb-2">
                Bản đồ không khả dụng
              </p>
              <p className="text-sm text-[var(--navy-slate-600)]">
                Vui lòng xem địa chỉ bên dưới
              </p>
            </div>
          </div>
        )}

        {/* Info Box Overlay (only when map is present) */}
        {mapUrl && (
          <div className="absolute bottom-4 left-4 bg-[var(--sand-gold-50)] backdrop-blur-sm bg-opacity-95 rounded-lg p-4 shadow-warm-md max-w-md">
            {/* Address */}
            <div className="flex items-start gap-2 mb-2">
              <MapPin className="w-5 h-5 text-[var(--ocean-blue-600)] flex-shrink-0 mt-0.5" />
              <div>
                {locationName && (
                  <p className="text-sm font-semibold text-[var(--navy-slate-900)] mb-1">
                    {locationName}
                  </p>
                )}
                <p className="text-sm text-[var(--navy-slate-700)]">
                  {address}
                </p>
              </div>
            </div>

            {/* Distance to Sea */}
            {distanceToSea && (
              <div className="flex items-center gap-2 pt-2 border-t border-[var(--sand-gold-200)]">
                <Waves className="w-5 h-5 text-[var(--ocean-blue-600)] flex-shrink-0" />
                <p className="text-sm text-[var(--navy-slate-700)]">
                  Cách biển: <span className="font-semibold">{distanceToSea}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Address and Distance Info (when no map) */}
      {!mapUrl && (
        <div className="space-y-4">
          {/* Address */}
          <div className="flex items-start gap-3 p-4 bg-[var(--ocean-blue-50)] rounded-lg">
            <MapPin className="w-5 h-5 text-[var(--ocean-blue-600)] flex-shrink-0 mt-0.5" />
            <div>
              {locationName && (
                <p className="text-sm font-semibold text-[var(--navy-slate-900)] mb-1">
                  {locationName}
                </p>
              )}
              <p className="text-sm text-[var(--navy-slate-700)]">
                {address}
              </p>
            </div>
          </div>

          {/* Distance to Sea */}
          {distanceToSea && (
            <div className="flex items-center gap-3 p-4 bg-[var(--teal-water-50)] rounded-lg">
              <Waves className="w-5 h-5 text-[var(--ocean-blue-600)] flex-shrink-0" />
              <p className="text-sm text-[var(--navy-slate-700)]">
                Cách biển: <span className="font-semibold">{distanceToSea}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
