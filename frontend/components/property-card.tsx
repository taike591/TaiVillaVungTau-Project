'use client';

import { memo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { MapPin, Users, Bed, Bath, Wifi, Car, Waves, Coffee, Shield, Tv, Clock, Building2, Star } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { WishlistButton } from './wishlist';
import { useInView } from '@/lib/hooks';
import { PriceDisplay } from './price-display';
import { 
  getDisplayName as getDisplayNameUtil, 
  getVillaCode, 
  getMainImage,
  hasMissingPrice,
  hasMissingAmenities,
  getMissingPriceMessage,
  getMissingImagesMessage
} from '@/lib/error-handling';

interface PropertyImage {
  id: number;
  imageUrl: string;
  displayOrder?: number;
  isThumbnail?: boolean;
}

interface Amenity {
  id: number;
  name: string;
  iconCode?: string;
}

interface PropertyCardProps {
  property: {
    id: number;
    code: string;
    name?: string;
    description?: string;
    images?: PropertyImage[] | string[];
    priceWeekday: number;
    priceWeekend: number;
    bedroomCount: number;
    bedCount?: number;
    bathroomCount: number;
    standardGuests: number;
    maxGuests: number;
    location?: string;
    address?: string;
    area?: string;
    distanceToBeach?: string;
    amenities?: Amenity[];
    featured?: boolean;
  };
  variant?: 'default' | 'featured' | 'compact';
}

// Map amenity names to icons
const getAmenityIcon = (amenity: Amenity) => {
  const name = amenity.name.toLowerCase();
  const iconClass = "h-3.5 w-3.5";
  
  if (name.includes('wifi') || name.includes('internet')) {
    return <Wifi className={iconClass} />;
  }
  if (name.includes('bãi đỗ') || name.includes('xe')) {
    return <Car className={iconClass} />;
  }
  if (name.includes('hồ bơi') || name.includes('bể bơi')) {
    return <Waves className={iconClass} />;
  }
  if (name.includes('bếp') || name.includes('coffee')) {
    return <Coffee className={iconClass} />;
  }
  if (name.includes('camera') || name.includes('an ninh')) {
    return <Shield className={iconClass} />;
  }
  if (name.includes('tv') || name.includes('tivi')) {
    return <Tv className={iconClass} />;
  }
  
  return <div className="w-2 h-2 bg-current rounded-full" />;
};

function PropertyCardComponent({ property, variant = 'default' }: PropertyCardProps) {
  const t = useTranslations('common');
  const mainImage = getMainImage(property.images);
  const isFeatured = property.featured || property.priceWeekday >= 7000000;
  const { ref, isInView } = useInView({ threshold: 0.1, triggerOnce: true });
  const displayName = getDisplayNameUtil(property);
  const villaCode = getVillaCode(property.code);
  const missingPrice = hasMissingPrice(property.priceWeekday);
  const missingAmenities = hasMissingAmenities(property.amenities);
  const priceMessage = getMissingPriceMessage();
  const imagesMessage = getMissingImagesMessage();
  
  return (
    <div ref={ref} className={`card-fade-in ${isInView ? 'in-view' : ''} h-full`}>
      <Link href={`/properties/${property.id}`} className="block h-full" suppressHydrationWarning>
        <Card className="p-0 gap-0 overflow-hidden h-full flex flex-col transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-2xl shadow-lg rounded-2xl group bg-white border-0">
          {/* Image Section - Clean overlay design */}
          <div className="relative h-52 md:h-56 overflow-hidden">
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
            
            {mainImage ? (
              <Image
                src={mainImage}
                alt={`${displayName} - Villa ${property.bedroomCount} phòng ngủ tại ${property.area || 'Vũng Tàu'}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PC9zdmc+"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <Building2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">{imagesMessage}</p>
                </div>
              </div>
            )}
            
            {/* Villa Code Badge - Top right */}
            <div className="absolute top-3 right-3 z-20">
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#0c4a6e] text-white text-sm font-bold shadow-lg">
                {villaCode}
              </span>
            </div>
            
            {/* Featured Badge - Top left */}
            {isFeatured && (
              <div className="absolute top-3 left-3 z-20">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-orange-400 text-white text-sm font-bold shadow-lg">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {t('featured')}
                </span>
              </div>
            )}

            {/* Wishlist Button - Bottom left */}
            <div className="absolute bottom-3 left-3 z-20">
              <WishlistButton
                property={{
                  id: property.id,
                  code: property.code,
                  name: displayName,
                  image: mainImage || '',
                  priceWeekday: property.priceWeekday,
                  bedroomCount: property.bedroomCount,
                }}
                size="sm"
              />
            </div>
          </div>

          {/* Content Section - Improved hierarchy */}
          <CardContent className="p-4 flex flex-col flex-1 bg-white">
            {/* Property Name - Balanced size, matching address font weight and family */}
            <h3 className="font-sans font-medium text-[15px] md:text-base text-slate-800 leading-snug line-clamp-2 mb-2 group-hover:text-[#0891b2] transition-colors h-[2.75rem]">
              {displayName}
            </h3>

            {/* Address - More prominent, fixed height for 2 lines */}
            <div className="h-[2.6rem] mb-3 overflow-hidden">
              {(property.address || property.area) && (
                <div className="flex items-start gap-1.5 text-sm text-slate-600">
                  <MapPin className="h-4 w-4 text-[#0891b2] shrink-0 mt-0.5" />
                  <span className="line-clamp-2 font-medium leading-tight">
                    {property.address && property.area 
                      ? property.address
                      : property.address || property.area}
                  </span>
                </div>
              )}
            </div>

            {/* Property Info Grid - Cleaner layout */}
            <div className="grid grid-cols-4 gap-2 mb-3 py-2.5 px-3 bg-slate-50 rounded-xl">
              <div className="text-center">
                <Bed className="h-4 w-4 mx-auto text-[#0891b2] mb-0.5" />
                <p className="text-xs font-semibold text-slate-700">{property.bedroomCount}</p>
                <p className="text-[10px] text-slate-500">{t('room')}</p>
              </div>
              <div className="text-center">
                <Bed className="h-4 w-4 mx-auto text-[#f59e0b] mb-0.5" />
                <p className="text-xs font-semibold text-slate-700">{property.bedCount || property.bedroomCount}</p>
                <p className="text-[10px] text-slate-500">{t('bed')}</p>
              </div>
              <div className="text-center">
                <Bath className="h-4 w-4 mx-auto text-[#0891b2] mb-0.5" />
                <p className="text-xs font-semibold text-slate-700">{property.bathroomCount}</p>
                <p className="text-[10px] text-slate-500">WC</p>
              </div>
              <div className="text-center">
                <Users className="h-4 w-4 mx-auto text-[#10b981] mb-0.5" />
                <p className="text-xs font-semibold text-slate-700">{property.standardGuests || property.maxGuests || 0}-{property.maxGuests || 0}</p>
                <p className="text-[10px] text-slate-500">{t('guest')}</p>
              </div>
            </div>

            {/* Amenities - Pill style */}
            {!missingAmenities && property.amenities && property.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {property.amenities.slice(0, 4).map((amenity) => (
                  <span
                    key={amenity.id}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-cyan-50 text-cyan-700 rounded-full text-xs font-medium"
                    title={amenity.name}
                  >
                    {getAmenityIcon(amenity)}
                    <span className="truncate max-w-[70px]">{amenity.name}</span>
                  </span>
                ))}
                {property.amenities.length > 4 && (
                  <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                    +{property.amenities.length - 4}
                  </span>
                )}
              </div>
            )}

            {/* Check-in/Check-out - More visible */}
            <div className="flex items-center justify-center gap-2 py-2 mb-3 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-lg border border-cyan-100">
              <Clock className="h-4 w-4 text-cyan-600" />
              <span className="text-sm font-semibold text-cyan-700">14H IN</span>
              <span className="text-slate-400">—</span>
              <span className="text-sm font-semibold text-cyan-700">12H OUT</span>
            </div>

            {/* Price Section - Push to bottom */}
            <div className="mt-auto">
              {missingPrice ? (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-100">
                  <p className="text-[#0891b2] font-bold text-base">
                    {priceMessage.title}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {priceMessage.subtitle}
                  </p>
                </div>
              ) : (
                <PriceDisplay
                  weekdayPrice={property.priceWeekday}
                  weekendPrice={property.priceWeekend}
                  guestCount={property.standardGuests}
                  roomCount={property.bedroomCount}
                  variant="detailed"
                  className="h-full"
                />
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}

// Memoized PropertyCard to prevent re-renders when parent updates
export const PropertyCard = memo(PropertyCardComponent, (prevProps, nextProps) => {
  // Only re-render if property ID or key data changes
  const prev = prevProps.property;
  const next = nextProps.property;
  return (
    prev.id === next.id &&
    prev.priceWeekday === next.priceWeekday &&
    prev.priceWeekend === next.priceWeekend &&
    prev.featured === next.featured
  );
});

PropertyCard.displayName = 'PropertyCard';
