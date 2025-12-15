"use client";

import { PropertyCard } from "@/components/property-card";
import { HeroSection } from "@/components/hero-section";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { usePropertyTypes } from "@/lib/hooks/useLocationsAndTypes";
import { useTranslations } from 'next-intl';

// Location configuration with extended data for showcase
const LOCATIONS = [
  { 
    id: 'all',
    name: 'Tất cả', 
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80',
    description: 'Tất cả các villa và homestay tại Vũng Tàu',
    showcaseImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80',
  },
  { 
    id: 'BAI_SAU',
    name: 'Bãi Sau', 
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80',
    description: 'Khu vực bãi biển Thùy Vân sôi động, tập trung nhiều khách sạn và dịch vụ du lịch. Bãi biển dài với cát trắng mịn, nước biển trong xanh, là điểm đến lý tưởng cho các gia đình và nhóm bạn.',
    showcaseImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80',
  },
  { 
    id: 'BAI_TRUOC',
    name: 'Bãi Trước', 
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80',
    description: 'Trung tâm thành phố Vũng Tàu, gần công viên Bãi Trước và Bạch Dinh. Khu vực thuận tiện di chuyển, gần nhiều nhà hàng và quán cà phê view biển.',
    showcaseImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80',
  },
  { 
    id: 'LONG_CUNG',
    name: 'Long Cung', 
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80',
    description: 'Khu vực nghỉ dưỡng yên tĩnh với bãi cát rộng và sạch. Nơi đây có không gian thoáng đãng, phù hợp cho những ai muốn tận hưởng sự bình yên.',
    showcaseImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
  },
  { 
    id: 'BAI_DAU',
    name: 'Bãi Dâu', 
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1920&q=80',
    description: 'Khu vực yên bình, thích hợp nghỉ dưỡng, gần Đức Mẹ Bãi Dâu. Không gian xanh mát với nhiều cây cối, lý tưởng cho du lịch tâm linh và nghỉ ngơi.',
    showcaseImage: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&q=80',
  },
  { 
    id: 'TRUNG_TAM',
    name: 'Trung Tâm', 
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&q=80',
    description: 'Khu vực trung tâm sầm uất, thuận tiện di chuyển đến các điểm ăn uống và vui chơi. Gần chợ, siêu thị và các tiện ích đầy đủ.',
    showcaseImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80',
  },
];

// Backend LocationType enum mapping
const LOCATION_MAPPING: Record<string, string> = {
  'BAI_SAU': 'Bãi Sau',
  'BAI_TRUOC': 'Bãi Trước',
  'LONG_CUNG': 'Long Cung',
  'BAI_DAU': 'Bãi Dâu',
  'TRUNG_TAM': 'Trung Tâm'
};

// Calculate location counts and IDs from properties
function getLocationData(properties: any[]): Record<string, { count: number; locationId?: number }> {
  const data: Record<string, { count: number; locationId?: number }> = {
    'all': { count: properties.length },
    'BAI_SAU': { count: 0 },
    'BAI_TRUOC': { count: 0 },
    'LONG_CUNG': { count: 0 },
    'BAI_DAU': { count: 0 },
    'TRUNG_TAM': { count: 0 }
  };
  
  properties.forEach((property: any) => {
    if (property.locationName) {
      const locationKey = Object.entries(LOCATION_MAPPING).find(
        ([, name]) => name === property.locationName
      )?.[0];
      
      if (locationKey && data[locationKey]) {
        data[locationKey].count++;
        if (property.locationId) {
          data[locationKey].locationId = property.locationId;
        }
      }
    }
    else if (property.location && data[property.location]) {
      data[property.location].count++;
    }
  });
  
  return data;
}

// Calculate property type counts from properties (filtered by location)
function getPropertyTypeData(properties: any[], selectedLocation: string): Record<string, number> {
  // First filter by location
  const locationFiltered = selectedLocation === 'all' 
    ? properties 
    : properties.filter((p: any) => {
        if (p.locationName) {
          return p.locationName === LOCATION_MAPPING[selectedLocation];
        }
        return p.location === selectedLocation;
      });
  
  const data: Record<string, number> = { 'all': locationFiltered.length };
  
  locationFiltered.forEach((property: any) => {
    if (property.propertyTypeName) {
      data[property.propertyTypeName] = (data[property.propertyTypeName] || 0) + 1;
    }
  });
  
  return data;
}

import { PropertyCardSkeleton as SharedPropertyCardSkeleton } from "@/components/shared/LoadingState";

function HeroSkeleton() {
  return (
    <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-6 animate-pulse">
          <div className="h-24 w-24 mx-auto bg-slate-700 rounded-2xl" />
          <div className="h-12 w-80 mx-auto bg-slate-700 rounded-lg" />
          <div className="h-6 w-96 mx-auto bg-slate-700 rounded-lg" />
        </div>
      </div>
    </section>
  );
}

function useHomeProperties(initialData: any[]) {
  return useQuery({
    queryKey: ['home-properties'],
    queryFn: async () => {
      const response = await api.get('/api/v1/properties?size=100');
      return response.data.data.content;
    },
    initialData: initialData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

interface HomePageContentProps {
  initialData: any[];
}

export function HomePageContent({ initialData }: HomePageContentProps) {
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedPropertyType, setSelectedPropertyType] = useState('all');
  const [showcaseIndex, setShowcaseIndex] = useState(0);
  const { data: properties, isPending, error } = useHomeProperties(initialData);
  const { data: propertyTypes } = usePropertyTypes();
  const t = useTranslations('home');
  const tCommon = useTranslations('common');

  const showSkeleton = isPending && !properties;

  if (showSkeleton) {
    return (
      <>
        <HeroSkeleton />
        <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1280px]">
            <div className="flex items-center justify-between mb-8 md:mb-12">
              <div className="animate-pulse">
                <div className="h-10 w-64 bg-slate-200 rounded-lg" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <SharedPropertyCardSkeleton count={4} />
            </div>
          </div>
        </section>
      </>
    );
  }

  if (error || !properties) {
    return (
      <>
        <HeroSkeleton />
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-500">Failed to load properties</p>
          </div>
        </section>
      </>
    );
  }

  // Calculate data from properties
  let featuredVillas = properties.filter((p: any) => p.isFeatured).slice(0, 5);
  if (featuredVillas.length === 0) {
    featuredVillas = properties.slice(0, 5);
  }
  
  const locationData = getLocationData(properties);
  const propertyTypeData = getPropertyTypeData(properties, selectedLocation);
  
  // Filter properties based on selected location and property type
  const filteredProperties = properties.filter((p: any) => {
    // Location filter
    const locationMatch = selectedLocation === 'all' || 
      (p.locationName ? p.locationName === LOCATION_MAPPING[selectedLocation] : p.location === selectedLocation);
    
    // Property type filter
    const typeMatch = selectedPropertyType === 'all' || p.propertyTypeName === selectedPropertyType;
    
    return locationMatch && typeMatch;
  });
  
  // Only show 4 properties in the grid
  const gridVillas = filteredProperties.slice(0, 4);
  
  // Locations for showcase (excluding 'all')
  const showcaseLocations = LOCATIONS.filter(loc => loc.id !== 'all');

  return (
    <>
      {/* Hero Section */}
      <HeroSection villas={featuredVillas} />

      {/* Property Grid Section - Coastal Cool Design */}
      <section 
        className="relative py-20 md:py-28 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 40%, #cffafe 70%, #a5f3fc 100%)',
        }}
        aria-labelledby="properties-heading"
      >
        {/* Palm Tree SVG - Right side - Hidden on mobile */}
        <div className="absolute top-10 right-4 sm:right-10 w-20 sm:w-32 md:w-40 h-auto opacity-[0.08] pointer-events-none hidden sm:block">
          <svg viewBox="0 0 100 150" fill="currentColor" className="text-[#0891b2]">
            {/* Palm trunk */}
            <path d="M48,150 Q50,100 52,60 Q54,100 52,150 Z" fill="#8B7355"/>
            {/* Palm leaves */}
            <path d="M50,60 Q30,40 10,50 Q35,45 50,60" />
            <path d="M50,60 Q70,40 90,50 Q65,45 50,60" />
            <path d="M50,60 Q25,30 5,25 Q30,35 50,60" />
            <path d="M50,60 Q75,30 95,25 Q70,35 50,60" />
            <path d="M50,60 Q50,20 50,5 Q50,25 50,60" />
            <path d="M50,60 Q20,50 0,60 Q25,55 50,60" />
            <path d="M50,60 Q80,50 100,60 Q75,55 50,60" />
          </svg>
        </div>

        {/* Sun SVG - Left side */}
        <div className="absolute top-16 sm:top-20 left-4 sm:left-10 w-12 sm:w-16 md:w-20 h-auto opacity-[0.1] pointer-events-none">
          <svg viewBox="0 0 100 100" fill="currentColor" className="text-amber-400">
            {/* Sun circle */}
            <circle cx="50" cy="50" r="20" />
            {/* Sun rays */}
            <g strokeWidth="3" stroke="currentColor">
              <line x1="50" y1="15" x2="50" y2="5" />
              <line x1="50" y1="95" x2="50" y2="85" />
              <line x1="15" y1="50" x2="5" y2="50" />
              <line x1="95" y1="50" x2="85" y2="50" />
              <line x1="25" y1="25" x2="18" y2="18" />
              <line x1="75" y1="75" x2="82" y2="82" />
              <line x1="75" y1="25" x2="82" y2="18" />
              <line x1="25" y1="75" x2="18" y2="82" />
            </g>
          </svg>
        </div>

        {/* Seagull SVG - Decorative birds */}
        <div className="absolute top-32 sm:top-40 right-1/4 w-8 sm:w-12 h-auto opacity-[0.15] pointer-events-none hidden md:block">
          <svg viewBox="0 0 50 20" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-600">
            <path d="M0,10 Q12,0 25,10 Q38,0 50,10" />
          </svg>
        </div>
        <div className="absolute top-24 sm:top-32 right-1/3 w-6 sm:w-8 h-auto opacity-[0.1] pointer-events-none hidden md:block">
          <svg viewBox="0 0 50 20" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-600">
            <path d="M0,10 Q12,0 25,10 Q38,0 50,10" />
          </svg>
        </div>

        {/* Floating particles - Beach sand effect */}
        <div className="absolute bottom-20 left-10 w-2 h-2 rounded-full bg-amber-300/20 animate-pulse hidden sm:block" />
        <div className="absolute bottom-32 right-20 w-1.5 h-1.5 rounded-full bg-cyan-400/20 animate-pulse hidden sm:block" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/2 left-1/4 w-1 h-1 rounded-full bg-teal-400/15 animate-pulse hidden md:block" style={{ animationDelay: '1s' }} />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1280px] relative z-10">
          {/* Section Header with Premium Typography */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 rounded-full bg-white/80 backdrop-blur-sm border border-cyan-100 shadow-sm">
              <svg className="w-5 h-5 text-cyan-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              <span className="text-cyan-700 text-sm font-semibold tracking-wide uppercase">{t('discoverVacation')}</span>
            </div>
            <h2 
              id="properties-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
              style={{ fontFamily: 'var(--font-heading), "Playfair Display", serif' }}
            >
              <span className="text-[#0c4a6e]">Villa & Homestay</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0891b2] to-[#0ea5e9]">
                Vũng Tàu
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              {t('experienceDescription')}
            </p>
          </div>

          {/* Location Tabs - Premium Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            {LOCATIONS.map((location) => {
              const data = locationData[location.id] || { count: 0 };
              const isActive = selectedLocation === location.id;
              
              return (
                <button
                  key={location.id}
                  onClick={() => setSelectedLocation(location.id)}
                  className={cn(
                    "group relative px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-300",
                    "border-2 hover:shadow-lg hover:-translate-y-0.5",
                    isActive 
                      ? "bg-gradient-to-r from-[#0c4a6e] to-[#0891b2] text-white border-transparent shadow-lg shadow-cyan-500/25" 
                      : "bg-white/80 backdrop-blur-sm text-[#0c4a6e] border-[#0c4a6e]/20 hover:border-[#0891b2]"
                  )}
                >
                  <span className="flex items-center gap-2">
                    {location.name}
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-bold",
                      isActive 
                        ? "bg-white/20 text-white" 
                        : "bg-[#0c4a6e]/10 text-[#0c4a6e]"
                    )}>
                      {data.count}
                    </span>
                  </span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-lg" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Property Type Tabs */}
          {propertyTypes && propertyTypes.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
              <span className="text-sm text-[#0c4a6e]/70 font-medium mr-2">{tCommon('propertyType')}:</span>
              <button
                onClick={() => setSelectedPropertyType('all')}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                  selectedPropertyType === 'all'
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/25"
                    : "bg-white/60 text-[#0c4a6e] hover:bg-white/80 border border-[#0c4a6e]/10"
                )}
              >
                {tCommon('all')}
                <span className={cn(
                  "ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold",
                  selectedPropertyType === 'all'
                    ? "bg-white/20 text-white"
                    : "bg-[#0c4a6e]/10 text-[#0c4a6e]"
                )}>
                  {propertyTypeData['all'] || 0}
                </span>
              </button>
              {propertyTypes.map((type) => {
                const count = propertyTypeData[type.name] || 0;
                const isActive = selectedPropertyType === type.name;
                
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedPropertyType(type.name)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                      isActive
                        ? "bg-amber-500 text-white shadow-md shadow-amber-500/25"
                        : "bg-white/60 text-[#0c4a6e] hover:bg-white/80 border border-[#0c4a6e]/10"
                    )}
                  >
                    {type.name}
                    <span className={cn(
                      "ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-[#0c4a6e]/10 text-[#0c4a6e]"
                    )}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Property Grid with Animation */}
          {gridVillas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {gridVillas.map((property: any, index: number) => (
                <div 
                  key={property.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl border border-amber-100">
              <svg className="w-16 h-16 mx-auto mb-4 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"/>
              </svg>
              <p className="text-gray-600 text-lg font-medium">{t('noVillasInArea')}</p>
              <p className="text-gray-400 text-sm mt-2">{t('pleaseSelectOther')}</p>
            </div>
          )}

          {/* View All CTA */}
          <div className="text-center mt-14">
            <Button 
              asChild 
              size="lg" 
              className="group relative px-10 py-6 rounded-full bg-gradient-to-r from-[#0c4a6e] to-[#0891b2] text-white font-semibold text-base overflow-hidden shadow-xl shadow-cyan-500/20 hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 hover:-translate-y-1"
            >
              <Link href="/properties" suppressHydrationWarning>
                <span className="relative z-10 flex items-center gap-3">
                  {tCommon('viewAllVilla')}
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                {/* Shimmer effect */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Wave Divider SVG at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
          <svg 
            viewBox="0 0 1440 120" 
            preserveAspectRatio="none" 
            className="absolute bottom-0 w-full h-full"
            fill="#67e8f9"
          >
            <path d="M0,64 C240,120 480,20 720,64 C960,108 1200,20 1440,64 L1440,120 L0,120 Z">
              <animate 
                attributeName="d" 
                dur="10s" 
                repeatCount="indefinite"
                values="
                  M0,64 C240,120 480,20 720,64 C960,108 1200,20 1440,64 L1440,120 L0,120 Z;
                  M0,64 C240,20 480,100 720,64 C960,28 1200,100 1440,64 L1440,120 L0,120 Z;
                  M0,64 C240,120 480,20 720,64 C960,108 1200,20 1440,64 L1440,120 L0,120 Z
                "
              />
            </path>
          </svg>
        </div>
      </section>

      {/* Location Showcase Section - Ocean Immersive Design */}
      <section 
        className="relative py-24 md:py-32 overflow-hidden"
        aria-labelledby="locations-heading"
        style={{
          background: 'linear-gradient(180deg, #67e8f9 0%, #22d3ee 10%, #06b6d4 25%, #0891b2 50%, #0c4a6e 100%)',
        }}
      >
        {/* Animated wave patterns */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <svg className="absolute -bottom-20 left-0 w-[200%] h-40" viewBox="0 0 2880 120" preserveAspectRatio="none">
            <path fill="white" d="M0,60 C480,120 960,0 1440,60 C1920,120 2400,0 2880,60 L2880,120 L0,120 Z">
              <animateTransform attributeName="transform" type="translate" values="0,0; -1440,0; 0,0" dur="15s" repeatCount="indefinite"/>
            </path>
          </svg>
          <svg className="absolute -bottom-10 left-0 w-[200%] h-32 opacity-50" viewBox="0 0 2880 100" preserveAspectRatio="none">
            <path fill="white" d="M0,50 C480,100 960,0 1440,50 C1920,100 2400,0 2880,50 L2880,100 L0,100 Z">
              <animateTransform attributeName="transform" type="translate" values="-1440,0; 0,0; -1440,0" dur="12s" repeatCount="indefinite"/>
            </path>
          </svg>
        </div>

        {/* Floating beach decorations */}
        <div className="absolute top-20 right-20 w-32 h-32 opacity-10 pointer-events-none animate-pulse">
          <svg viewBox="0 0 100 100" fill="white">
            <path d="M50,10 C70,10 80,25 80,40 C80,55 65,70 50,90 C35,70 20,55 20,40 C20,25 30,10 50,10 M30,45 Q50,35 70,45 M35,55 Q50,45 65,55"/>
          </svg>
        </div>
        <div className="absolute bottom-40 left-16 w-24 h-24 opacity-10 pointer-events-none" style={{ animation: 'warmFloat 4s ease-in-out infinite' }}>
          <svg viewBox="0 0 100 100" fill="white">
            <circle cx="50" cy="50" r="20"/>
            <path d="M50,25 L50,5 M75,50 L95,50 M50,75 L50,95 M25,50 L5,50"/>
          </svg>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] relative z-10">
          {/* Section Header - Premium White */}
          <div className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
              <svg className="w-5 h-5 text-cyan-200" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              <span className="text-white/90 text-sm font-semibold tracking-wide uppercase">{t('favoriteDestinations')}</span>
            </div>
            <h2 
              id="locations-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg"
              style={{ fontFamily: 'var(--font-heading), "Playfair Display", serif' }}
            >
              {t('discoverBestAreas')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-teal-200">
                {t('bestAreas')}
              </span>
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto text-lg leading-relaxed">
              {t('findPerfectPlace')}
            </p>
          </div>

          {/* Main Content Card - Premium Glassmorphism */}
          <div 
            className="relative rounded-2xl sm:rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 32px 64px -16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
          >
            <div className="flex flex-col lg:flex-row">
              {/* Left Side - Content */}
              <div className="flex-1 p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col relative justify-center order-2 lg:order-1">
                {/* Location Tabs - Responsive Pills */}
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 sm:mb-10 lg:mb-12">
                  {showcaseLocations.map((location, idx) => {
                    const isActive = showcaseIndex === idx;
                    const count = locationData[location.id]?.count || 0;
                    return (
                      <button
                        key={location.id}
                        onClick={() => setShowcaseIndex(idx)}
                        className={cn(
                          "relative px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300",
                          isActive 
                            ? "bg-white text-[#0c4a6e] shadow-xl shadow-white/20 scale-105" 
                            : "bg-white/10 text-white/90 hover:bg-white/20 border border-white/20"
                        )}
                      >
                        <span className="flex items-center gap-1.5 sm:gap-2">
                          {location.name}
                          <span className={cn(
                            "px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold",
                            isActive ? "bg-cyan-100 text-cyan-700" : "bg-white/20 text-white"
                          )}>
                            {count}
                          </span>
                        </span>
                        {isActive && (
                          <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 sm:w-8 h-0.5 sm:h-1 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Content Area */}
                <div className="flex flex-col">
                  {/* Location Name with Icon */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg transition-all duration-500"
                      style={{ fontFamily: 'var(--font-heading), "Playfair Display", serif' }}
                    >
                      {showcaseLocations[showcaseIndex]?.name}
                    </h3>
                  </div>
                  
                  {/* Description with gradient border */}
                  <div className="relative pl-4 sm:pl-6 mb-6 sm:mb-8 lg:mb-10">
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 sm:w-1 bg-gradient-to-b from-cyan-400 via-teal-400 to-transparent rounded-full" />
                    <p className="text-white/80 leading-relaxed text-sm sm:text-base lg:text-lg min-h-[3rem] sm:min-h-[4.5rem] line-clamp-2 sm:line-clamp-3">
                      {showcaseLocations[showcaseIndex]?.description}
                    </p>
                  </div>
                  
                  {/* Stats Cards - Responsive Grid */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-10">
                    <div 
                      className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl sm:rounded-2xl"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                      }}
                    >
                      <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
                        {locationData[showcaseLocations[showcaseIndex]?.id]?.count || 0}
                      </span>
                      <span className="text-white/80 text-xs sm:text-sm font-medium mt-1">Villa & Homestay</span>
                    </div>
                    <div 
                      className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl sm:rounded-2xl"
                      style={{
                        background: 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(6,182,212,0.1) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                      }}
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-green-300 text-xs sm:text-sm font-bold">{tCommon('ready')}</span>
                      </span>
                      <span className="text-white/80 text-xs sm:text-sm font-medium mt-1">{tCommon('bookNow')}</span>
                    </div>
                  </div>
                  
                  {/* CTA and Navigation - Responsive */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                    <Button 
                      asChild 
                      className="group relative overflow-hidden bg-white text-[#0c4a6e] font-bold rounded-full px-6 sm:px-8 py-4 sm:py-5 text-sm sm:text-base shadow-2xl shadow-white/20 hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 flex-1 sm:flex-none"
                    >
                      <Link href={locationData[showcaseLocations[showcaseIndex]?.id]?.locationId 
                        ? `/properties?locationId=${locationData[showcaseLocations[showcaseIndex]?.id]?.locationId}` 
                        : '/properties'} suppressHydrationWarning>
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {tCommon('exploreNow')}
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-cyan-100 to-teal-100 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                      </Link>
                    </Button>

                    {/* Navigation Controls - Smaller */}
                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                      <button
                        onClick={() => setShowcaseIndex(prev => prev === 0 ? showcaseLocations.length - 1 : prev - 1)}
                        className="group w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 hover:scale-105 transition-all duration-300"
                        aria-label="Previous location"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setShowcaseIndex(prev => prev === showcaseLocations.length - 1 ? 0 : prev + 1)}
                        className="group w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 hover:scale-105 transition-all duration-300"
                        aria-label="Next location"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Image with Ken Burns Effect */}
              <div className="flex-1 relative h-[300px] sm:h-[400px] lg:h-[600px] overflow-hidden order-1 lg:order-2">
                <div className="absolute inset-0 animate-slow-zoom">
                  <img
                    src={showcaseLocations[showcaseIndex]?.showcaseImage}
                    alt={showcaseLocations[showcaseIndex]?.name}
                    className="w-full h-full object-cover transition-all duration-1000"
                  />
                </div>
                
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0c4a6e]/50 via-transparent to-transparent hidden lg:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c4a6e]/60 via-transparent to-transparent lg:from-[#0c4a6e]/30" />
                
                {/* Location Badge - Responsive */}
                <div 
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1.5 sm:gap-2 shadow-xl"
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.25)',
                  }}
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white text-xs sm:text-sm font-semibold">Vũng Tàu</span>
                </div>

                {/* Progress indicators - Responsive */}
                <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 flex items-center gap-1.5 sm:gap-2">
                  {showcaseLocations.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setShowcaseIndex(idx)}
                      className={cn(
                        "h-1.5 sm:h-2 rounded-full transition-all duration-300",
                        idx === showcaseIndex
                          ? "w-6 sm:w-8 bg-white"
                          : "w-1.5 sm:w-2 bg-white/40 hover:bg-white/60"
                      )}
                      aria-label={`Go to location ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Mobile swipe hint */}
                <div className="absolute bottom-4 left-4 sm:hidden flex items-center gap-1.5 text-white/60 text-xs">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  <span>{tCommon('swipeToView')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave transition to next section */}
        <div className="absolute -bottom-1 left-0 right-0 h-32 overflow-hidden">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-full" fill="#cffafe">
            <path d="M0,40 C360,100 720,0 1080,60 C1260,90 1380,70 1440,60 L1440,120 L0,120 Z"/>
          </svg>
        </div>

        {/* Ken Burns animation style */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes slow-zoom {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.08); }
          }
          .animate-slow-zoom {
            animation: slow-zoom 20s ease-in-out infinite;
          }
        `}} />
      </section>

      {/* Customer Feedback Section - Coastal Pearl Design */}
      <section 
        className="relative py-24 md:py-32 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #cffafe 0%, #e0f2fe 15%, #f0f9ff 40%, #f8fafc 100%)',
        }}
        aria-labelledby="feedback-heading"
      >
        {/* Seamless top wave connection */}
        <div className="absolute top-0 left-0 right-0 h-20 overflow-hidden -mt-1">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-full" fill="#cffafe">
            <path d="M0,0 L1440,0 L1440,40 C1200,80 960,0 720,40 C480,80 240,0 0,40 Z"/>
          </svg>
        </div>

        {/* Decorative seashell SVG */}
        <div className="absolute top-32 right-16 w-40 h-40 opacity-[0.05] pointer-events-none">
          <svg viewBox="0 0 100 100" fill="currentColor" className="text-[#0c4a6e]">
            <path d="M50,10 C30,10 15,30 15,50 C15,75 35,90 50,90 C65,90 85,75 85,50 C85,30 70,10 50,10 M25,50 Q50,35 75,50 M30,60 Q50,45 70,60 M35,70 Q50,55 65,70"/>
          </svg>
        </div>
        <div className="absolute bottom-40 left-10 w-24 h-24 opacity-[0.05] pointer-events-none" style={{ animation: 'warmFloat 5s ease-in-out infinite reverse' }}>
          <svg viewBox="0 0 100 100" fill="currentColor" className="text-[#0891b2]">
            <circle cx="50" cy="50" r="40" strokeWidth="2" fill="none" stroke="currentColor"/>
            <circle cx="50" cy="50" r="30"/>
            <path d="M50,10 L50,90 M10,50 L90,50"/>
          </svg>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1300px] relative z-10">
          {/* Section Header - Premium with coral accent */}
          <div className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 rounded-full bg-white shadow-lg shadow-slate-200/50 border border-slate-100">
              <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
              </svg>
              <span className="text-slate-700 text-sm font-semibold tracking-wide uppercase">{t('fanpageReviews')}</span>
            </div>
            <h2 
              id="feedback-heading" 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0c4a6e] mb-6"
              style={{ fontFamily: 'var(--font-heading), "Playfair Display", serif' }}
            >
              {t('customersLove')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fb7185] to-[#f43f5e]">
                {t('whatTheySay')}
              </span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
              {t('reviewsDescription')}
            </p>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6].map((id, index) => (
              <div 
                key={id}
                className={cn(
                  "group relative",
                  // Staggered effect - offset every other item
                  index % 2 === 1 && "lg:mt-12"
                )}
              >
                {/* Decorative Quote Mark */}
                <div className="absolute -top-6 -left-4 text-8xl font-serif text-gray-100 select-none pointer-events-none z-0">
                  "
                </div>

                {/* Main Card Container */}
                <div className={cn(
                  "relative rounded-2xl overflow-hidden",
                  "bg-white border border-gray-100",
                  "shadow-xl shadow-gray-200/50",
                  "transform transition-all duration-300 ease-out",
                  "hover:shadow-2xl hover:shadow-blue-500/10",
                  "hover:-translate-y-2 hover:border-blue-100"
                )}>
                  {/* Top Bar */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
                      </svg>
                      <span className="text-xs text-gray-500 font-medium">facebook.com/TaiVillaVungTau</span>
                    </div>
                  </div>

                  {/* Screenshot Image */}
                  <div className="relative group-hover:opacity-95 transition-opacity">
                    <img
                      src={`/fb${id}.png`}
                      alt={`Đánh giá Facebook #${id}`}
                      className="w-full h-auto block"
                    />
                  </div>

                  {/* Bottom Badge Bar */}
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-600 font-semibold">5.0</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-full border border-green-100">
                      <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[10px] text-green-600 font-semibold uppercase tracking-wide">Xác thực</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Section - Stats & CTA */}
          <div className="mt-16 md:mt-20">
            {/* Divider */}
            <div className="w-full max-w-xs mx-auto h-px bg-gray-200 mb-10" />

            {/* Stats Row */}
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 mb-10">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-900 text-3xl font-bold">5.0 / 5.0</p>
                <p className="text-gray-500 text-sm">{t('averageRating')}</p>
              </div>
              <div className="hidden md:block w-px h-16 bg-gray-200" />
              <div className="text-center">
                <p className="text-[#0ea5e9] text-4xl font-bold">100+</p>
                <p className="text-gray-500 text-sm">{t('fiveStarReviews')}</p>
              </div>
              <div className="hidden md:block w-px h-16 bg-gray-200" />
              <div className="text-center">
                <p className="text-green-500 text-4xl font-bold">100%</p>
                <p className="text-gray-500 text-sm">{t('satisfiedCustomers')}</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <a 
                href="https://www.facebook.com/TaiVillaVungTau/reviews" 
                target="_blank" 
                rel="noopener noreferrer"
                suppressHydrationWarning
                className="group inline-flex items-center gap-3 px-8 py-4 bg-[#1877F2] text-white font-semibold rounded-full shadow-lg shadow-blue-200 hover:shadow-xl hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
                </svg>
                <span>{t('viewAllFacebookReviews')}</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Request Section - Ocean Immersive Design */}
      <section 
        className="relative py-24 md:py-32 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #0c4a6e 0%, #0891b2 50%, #06b6d4 100%)',
        }}
      >
        {/* Wave patterns */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
          <svg className="absolute top-0 left-0 w-[200%] h-40" viewBox="0 0 2880 120" preserveAspectRatio="none">
            <path fill="white" d="M0,60 C480,120 960,0 1440,60 C1920,120 2400,0 2880,60 L2880,120 L0,120 Z">
              <animateTransform attributeName="transform" type="translate" values="0,0; -1440,0; 0,0" dur="20s" repeatCount="indefinite"/>
            </path>
          </svg>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left side - Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                <svg className="w-5 h-5 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-white/90 text-sm font-semibold">Hỗ trợ 24/7</span>
              </div>
              <h2 
                className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg"
                style={{ fontFamily: 'var(--font-heading), "Playfair Display", serif' }}
              >
                Gửi Yêu Cầu{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-teal-200">
                  Tư Vấn
                </span>
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-8">
                Để lại thông tin, đội ngũ tư vấn sẽ liên hệ bạn trong vòng 30 phút để hỗ trợ tìm villa phù hợp nhất
              </p>
              
              {/* Trust badges */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Miễn phí tư vấn</span>
                </div>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Phản hồi nhanh</span>
                </div>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>100+ villa</span>
                </div>
              </div>
            </div>

            {/* Right side - Form Card */}
            <div 
              className="rounded-3xl p-8 md:p-10"
              style={{
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 32px 64px -16px rgba(0,0,0,0.3)',
              }}
            >
              <form className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Họ và tên</label>
                    <input 
                      type="text" 
                      placeholder="Nguyễn Văn A"
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-100 focus:border-cyan-400 focus:ring-0 transition-colors bg-slate-50/50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Số điện thoại <span className="text-red-500">*</span></label>
                    <input 
                      type="tel" 
                      required
                      placeholder="0868 947 734"
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-100 focus:border-cyan-400 focus:ring-0 transition-colors bg-slate-50/50 focus:bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Ghi chú / Yêu cầu</label>
                  <textarea 
                    rows={3}
                    placeholder="VD: Thuê villa 10 người, ngày 15/1, có hồ bơi..."
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-100 focus:border-cyan-400 focus:ring-0 transition-colors bg-slate-50/50 focus:bg-white resize-none"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#0c4a6e] to-[#0891b2] text-white font-bold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>Gửi Yêu Cầu Tư Vấn</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>

              {/* Quick contact */}
              <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-6 text-sm">
                <a href="tel:0868947734" className="flex items-center gap-2 text-slate-600 hover:text-cyan-600 transition-colors font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  0868.947.734
                </a>
                <a href="https://zalo.me/0868947734" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-medium">
                  <span className="w-4 h-4 bg-blue-500 text-white text-[10px] font-bold rounded flex items-center justify-center">Z</span>
                  Zalo
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute -bottom-1 left-0 right-0 h-24 overflow-hidden">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-full" fill="#f8fafc">
            <path d="M0,50 C360,100 720,0 1080,50 C1260,75 1380,60 1440,50 L1440,100 L0,100 Z"/>
          </svg>
        </div>
      </section>

      {/* FAQ Section - Clean & Professional */}
      <section 
        className="relative py-20 md:py-28 bg-slate-50"
        aria-labelledby="faq-heading"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white shadow-sm border border-slate-100">
              <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-slate-600 text-sm font-semibold">Câu hỏi thường gặp</span>
            </div>
            <h2 
              id="faq-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0c4a6e] mb-4"
              style={{ fontFamily: 'var(--font-heading), "Playfair Display", serif' }}
            >
              Thông Tin{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0891b2] to-[#0ea5e9]">
                Cần Biết
              </span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Giải đáp các thắc mắc phổ biến về quy trình đặt villa
            </p>
          </div>

          {/* FAQ Grid - 2 columns on desktop */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* FAQ Item 1 */}
            <details className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100">
              <summary className="flex items-center gap-4 cursor-pointer p-5">
                <span className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-cyan-200">1</span>
                <span className="flex-1 font-semibold text-[#0c4a6e] text-sm md:text-base">Cách thức đặt lịch?</span>
                <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed ml-14">
                <ol className="list-decimal list-inside space-y-2">
                  <li>Chốt lại thông tin cuối cùng (ngày đi + số lượng, tên khách hàng, SĐT khách hàng)</li>
                  <li>Cọc 50% tiền villa (sau khi cọc thì không thể đổi căn, đổi ngày hay nếu huỷ nhà sẽ mất 100% tiền cọc)</li>
                  <li>Sau khi cọc, bên mình sẽ gửi cho bạn 1 bản xác nhận, bao gồm tất cả thông tin cần thiết</li>
                  <li>Quản gia sẽ chủ động liên hệ cho bạn vào lúc sau khi check out khách hôm nay.</li>
                </ol>
              </div>
            </details>

            {/* FAQ Item 2 */}
            <details className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100">
              <summary className="flex items-center gap-4 cursor-pointer p-5">
                <span className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-cyan-200">2</span>
                <span className="flex-1 font-semibold text-[#0c4a6e] text-sm md:text-base">Có hình thức nào để kiểm tra uy tín trước khi đặt cọc?</span>
                <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed ml-14">
                <p>Để an toàn và chắc chắn, anh chị đăng bài trên các hội nhóm liên quan đến dịch vụ để yên tâm hơn.</p>
              </div>
            </details>

            {/* FAQ Item 3 */}
            <details className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100">
              <summary className="flex items-center gap-4 cursor-pointer p-5">
                <span className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-amber-200">3</span>
                <span className="flex-1 font-semibold text-[#0c4a6e] text-sm md:text-base">Số tài khoản chính thức?</span>
                <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed ml-14">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-1">
                  <p><strong>STK:</strong> Nhập TAIVILLAVUNGTAU hoặc 80868947734</p>
                  <p><strong>Chủ TK:</strong> NGUYEN HO THANH TAI</p>
                  <p><strong>Ngân hàng:</strong> Techcombank - Ngân hàng TMCP Kỹ thương Việt Nam</p>
                  <p className="text-amber-700 font-semibold pt-2">⚠️ Taivillavungtau chỉ nhận tiền qua số tài khoản này!</p>
                </div>
              </div>
            </details>

            {/* FAQ Item 4 */}
            <details className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100">
              <summary className="flex items-center gap-4 cursor-pointer p-5">
                <span className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-cyan-200">4</span>
                <span className="flex-1 font-semibold text-[#0c4a6e] text-sm md:text-base">Giờ check in và check out?</span>
                <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed ml-14">
                <p>Giờ check in là <strong>14 giờ</strong> ngày hôm nay và check out là <strong>12 giờ</strong> ngày hôm sau.</p>
              </div>
            </details>

            {/* FAQ Item 5 */}
            <details className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100">
              <summary className="flex items-center gap-4 cursor-pointer p-5">
                <span className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-cyan-200">5</span>
                <span className="flex-1 font-semibold text-[#0c4a6e] text-sm md:text-base">Có thể hỗ trợ nhận nhà sớm không?</span>
                <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed ml-14">
                <p>Bên mình sẽ hỗ trợ nhận nhà sớm nhất có thể vào <strong>12 giờ</strong>.</p>
              </div>
            </details>

            {/* FAQ Item 6 */}
            <details className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100">
              <summary className="flex items-center gap-4 cursor-pointer p-5">
                <span className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-cyan-200">6</span>
                <span className="flex-1 font-semibold text-[#0c4a6e] text-sm md:text-base">Chính sách huỷ và đổi nhà?</span>
                <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed ml-14">
                <p>Tuỳ từng đối tác và Taivillavungtau làm việc sẽ có chính sách khác nhau.</p>
              </div>
            </details>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-slate-500 mb-4 text-sm">Còn thắc mắc? Liên hệ ngay!</p>
            <a 
              href="tel:0868947734"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0c4a6e] to-[#0891b2] text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Gọi 0868.947.734
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

