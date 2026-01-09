"use client";

import { PropertyCard } from "@/components/property-card";
import { HeroSection } from "@/components/hero-section";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { usePropertyTypes } from "@/lib/hooks/useLocationsAndTypes";
import { useLabels } from "@/lib/hooks/useLabels";
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

// Dynamic imports for below-the-fold sections
const FeedbackSection = dynamic(() => import('./FeedbackSection'), {
  loading: () => <div className="h-96 animate-pulse bg-slate-50" />,
  ssr: true
});

const RequestAdviceSection = dynamic(() => import('./RequestAdviceSection'), {
  loading: () => <div className="h-96 animate-pulse bg-slate-50" />,
  ssr: true
});

const FAQSection = dynamic(() => import('./FAQSection'), {
  loading: () => <div className="h-96 animate-pulse bg-slate-50" />,
  ssr: true
});

const TrustSections = dynamic(() => import('./TrustSections'), {
  loading: () => <div className="h-96 animate-pulse bg-slate-50" />,
  ssr: true
});

// Lazy load recently viewed - client-side only, no SSR needed
const RecentlyViewedSection = dynamic(() => import('./RecentlyViewedSection'), {
  loading: () => null,
  ssr: false // No SSR - depends on localStorage
});

// Floating Element Components for background accents
const FloatingDecoration = ({ className, delay = 0, duration = 15, size = 40 }: { className?: string, delay?: number, duration?: number, size?: number }) => (
  <div 
    className={cn("absolute pointer-events-none opacity-[0.05] z-0", className)}
    style={{ 
      animation: `warmFloat ${duration}s ease-in-out ${delay}s infinite alternate`,
      width: size,
      height: size
    }}
  >
    <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full text-cyan-600">
      <path d="M50,10 C30,10 15,30 15,50 C15,75 35,90 50,90 C65,90 85,75 85,50 C85,30 70,10 50,10 M25,50 Q50,35 75,50 M30,60 Q50,45 70,60 M35,70 Q50,55 65,70"/>
    </svg>
  </div>
);

const BubbleDecoration = ({ className, delay = 0, duration = 8, size = 20 }: { className?: string, delay?: number, duration?: number, size?: number }) => (
  <div 
    className={cn("absolute pointer-events-none opacity-[0.08] z-0", className)}
    style={{ 
      animation: `riseAndFade ${duration}s ease-in-out ${delay}s infinite`,
      width: size,
      height: size
    }}
  >
    <div className="w-full h-full rounded-full border-2 border-cyan-400 bg-cyan-100/20 shadow-inner shadow-white/50" />
  </div>
);


// Location configuration with extended data for showcase
const LOCATIONS = [
  { 
    id: 'all',
    name: 'Tất cả', 
    image: 'https://images2.thanhnien.vn/528068263637045248/2025/10/13/dji0824-1760324544283962847578.jpg?w=1920&q=80',
    description: 'Tất cả các villa và homestay tại Vũng Tàu',
    showcaseImage: 'https://images2.thanhnien.vn/528068263637045248/2025/10/13/dji0824-1760324544283962847578.jpg?w=1200&q=80',
  },
  { 
    id: 'BAI_SAU',
    name: 'Bãi Sau', 
    image: 'https://images2.thanhnien.vn/528068263637045248/2025/10/13/dji0824-1760324544283962847578.jpg',
    description: ' Khu vực bãi biển Thùy Vân sôi động, tập trung nhiều khách sạn và dịch vụ du lịch. Bãi biển dài với cát trắng mịn, nước biển trong xanh.',
    showcaseImage: 'https://images2.thanhnien.vn/528068263637045248/2025/10/13/dji0824-1760324544283962847578.jpg',
  },
  { 
    id: 'BAI_TRUOC',
    name: 'Bãi Trước', 
    image: 'https://bazantravel.com/cdn/medias/uploads/57/57590-bai-truoc-vung-tau-ve-dem.jpg?w=1920&q=80',
    description: 'Trung tâm thành phố Vũng Tàu, gần công viên Bãi Trước và Bạch Dinh. Khu vực thuận tiện di chuyển, gần nhiều nhà hàng và quán cà phê view biển.',
    showcaseImage: 'https://bazantravel.com/cdn/medias/uploads/57/57590-bai-truoc-vung-tau-ve-dem.jpg?w=1200&q=80',
  },
  { 
    id: 'LONG_CUNG',
    name: 'Long Cung', 
    image: 'https://odwintravel.vn/wp-content/uploads/2019/07/villa-long-cung-vung-tau.jpg?w=1920&q=80',
    description: 'Khu vực nghỉ dưỡng yên tĩnh với bãi cát rộng và sạch. Nơi đây có không gian thoáng đãng, phù hợp cho những ai muốn tận hưởng sự bình yên.',
    showcaseImage: 'https://odwintravel.vn/wp-content/uploads/2019/07/villa-long-cung-vung-tau.jpg?w=1200&q=80',
  },
  { 
    id: 'BAI_DAU',
    name: 'Bãi Dâu', 
    image: 'https://vielimousine.com/wp-content/uploads/2024/01/bai-dau-vung-tau-10.jpg?w=1920&q=80',
    description: 'Khu vực yên bình, thích hợp nghỉ dưỡng, gần Đức Mẹ Bãi Dâu. Không gian xanh mát với nhiều cây cối, lý tưởng cho du lịch tâm linh và nghỉ ngơi.',
    showcaseImage: 'https://vielimousine.com/wp-content/uploads/2024/01/bai-dau-vung-tau-10.jpg?w=1200&q=80',
  },
  { 
    id: 'TRUNG_TAM',
    name: 'Trung Tâm', 
    image: 'https://cafefcdn.com/203337114487263232/2023/10/30/vung-tau-1698465981868706183225-1698655039859-1698655042036709930409.jpg?w=1920&q=80',
    description: 'Khu vực trung tâm sầm uất, thuận tiện di chuyển đến các điểm ăn uống và vui chơi. Gần chợ, siêu thị và các tiện ích đầy đủ.',
    showcaseImage: 'https://cafefcdn.com/203337114487263232/2023/10/30/vung-tau-1698465981868706183225-1698655039859-1698655042036709930409.jpg?w=1200&q=80',
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
      // Auto-scaling fetch: get first page with max size, then remaining pages if needed
      const maxSize = 500; // Backend max limit
      
      const firstResponse = await api.get(`/api/v1/properties?size=${maxSize}&page=0`);
      const firstData = firstResponse.data.data;
      
      if (!firstData?.content) return initialData;
      
      const allProperties = [...firstData.content];
      const totalPages = firstData.totalPages || 1;
      
      // Fetch remaining pages in parallel if needed (for 500+ properties)
      if (totalPages > 1) {
        const remainingPromises = [];
        for (let page = 1; page < totalPages; page++) {
          remainingPromises.push(
            api.get(`/api/v1/properties?size=${maxSize}&page=${page}`)
              .then(res => res.data.data?.content || [])
              .catch(() => [])
          );
        }
        const results = await Promise.all(remainingPromises);
        results.forEach(content => allProperties.push(...content));
      }
      
      return allProperties;
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
  const [selectedLabelIds, setSelectedLabelIds] = useState<number[]>([]);
  const [showcaseIndex, setShowcaseIndex] = useState(0);
  const { data: properties, isPending, error } = useHomeProperties(initialData);
  const { data: propertyTypes } = usePropertyTypes();
  const { data: labels = [] } = useLabels();
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

  // Get all featured villas first (deterministic for SSR)
  const allFeaturedVillas = useMemo(() => {
    const featured = properties.filter((p: any) => p.isFeatured);
    if (featured.length > 0) {
      return featured.sort((a: any, b: any) => (a.id || 0) - (b.id || 0));
    }
    return properties.slice(0, 10); // Get more for shuffle pool
  }, [properties]);

  // State for randomly selected villas (shuffled on client after hydration)
  const [featuredVillas, setFeaturedVillas] = useState(() => 
    allFeaturedVillas.slice(0, 5)
  );

  // Shuffle on client after hydration to get random selection
  useEffect(() => {
    if (allFeaturedVillas.length > 5) {
      // Fisher-Yates shuffle
      const shuffled = [...allFeaturedVillas];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setFeaturedVillas(shuffled.slice(0, 5));
    }
  }, [allFeaturedVillas]);
  
  const locationData = getLocationData(properties);
  const propertyTypeData = getPropertyTypeData(properties, selectedLocation);
  
  // Filter properties based on selected location, property type, and labels
  const filteredProperties = properties.filter((p: any) => {
    // Location filter
    const locationMatch = selectedLocation === 'all' || 
      (p.locationName ? p.locationName === LOCATION_MAPPING[selectedLocation] : p.location === selectedLocation);
    
    // Property type filter
    const typeMatch = selectedPropertyType === 'all' || p.propertyTypeName === selectedPropertyType;
    
    // Label filter (ANY mode: property has at least one of selected labels)
    const labelMatch = selectedLabelIds.length === 0 || 
      (p.labels && p.labels.some((label: any) => selectedLabelIds.includes(label.id)));
    
    return locationMatch && typeMatch && labelMatch;
  });
  
  // Toggle label selection (multiple selection support)
  const handleLabelToggle = (labelId: number) => {
    setSelectedLabelIds(prev => 
      prev.includes(labelId) 
        ? prev.filter(id => id !== labelId)
        : [...prev, labelId]
    );
  };
  
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
          background: 'linear-gradient(180deg, #ffffff 0%, #f0f9ff 100%)',
        }}
        aria-labelledby="properties-heading"
      >
        {/* Floating Accents */}
        <FloatingDecoration className="top-40 left-12" delay={0} size={60} />
        <BubbleDecoration className="top-1/4 left-1/4" delay={1} size={15} />
        <BubbleDecoration className="top-1/2 right-1/3" delay={3} size={25} />
        <FloatingDecoration className="bottom-40 right-12" delay={2} size={80} />
        {/* Palm Tree SVG - Right side - Hidden on mobile */}
        <div className="absolute top-10 right-4 sm:right-10 w-20 sm:w-32 md:w-40 h-auto opacity-[0.08] pointer-events-none hidden sm:block" suppressHydrationWarning>
          <svg viewBox="0 0 100 150" fill="currentColor" className="text-[#0891b2]" suppressHydrationWarning>
            {/* Palm trunk */}
            <path d="M48,150 Q50,100 52,60 Q54,100 52,150 Z" fill="#8B7355" suppressHydrationWarning />
            {/* Palm leaves */}
            <path d="M50,60 Q30,40 10,50 Q35,45 50,60" suppressHydrationWarning />
            <path d="M50,60 Q70,40 90,50 Q65,45 50,60" suppressHydrationWarning />
            <path d="M50,60 Q25,30 5,25 Q30,35 50,60" suppressHydrationWarning />
            <path d="M50,60 Q75,30 95,25 Q70,35 50,60" suppressHydrationWarning />
            <path d="M50,60 Q50,20 50,5 Q50,25 50,60" suppressHydrationWarning />
            <path d="M50,60 Q20,50 0,60 Q25,55 50,60" suppressHydrationWarning />
            <path d="M50,60 Q80,50 100,60 Q75,55 50,60" suppressHydrationWarning />
          </svg>
        </div>

        {/* Sun SVG - Left side */}
        <div className="absolute top-16 sm:top-20 left-4 sm:left-10 w-12 sm:w-16 md:w-20 h-auto opacity-[0.1] pointer-events-none" suppressHydrationWarning>
          <svg viewBox="0 0 100 100" fill="currentColor" className="text-amber-400" suppressHydrationWarning>
            {/* Sun circle */}
            <circle cx="50" cy="50" r="20" suppressHydrationWarning />
            {/* Sun rays */}
            <g strokeWidth="3" stroke="currentColor" suppressHydrationWarning>
              <line x1="50" y1="15" x2="50" y2="5" suppressHydrationWarning />
              <line x1="50" y1="95" x2="50" y2="85" suppressHydrationWarning />
              <line x1="15" y1="50" x2="5" y2="50" suppressHydrationWarning />
              <line x1="95" y1="50" x2="85" y2="50" suppressHydrationWarning />
              <line x1="25" y1="25" x2="18" y2="18" suppressHydrationWarning />
              <line x1="75" y1="75" x2="82" y2="82" suppressHydrationWarning />
              <line x1="75" y1="25" x2="82" y2="18" suppressHydrationWarning />
              <line x1="25" y1="75" x2="18" y2="82" suppressHydrationWarning />
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
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight animate-fade-in-up"
              style={{ fontFamily: 'var(--font-heading), "Playfair Display", serif', animationDelay: '100ms' }}
            >
              <span className="text-[#0c4a6e]">Villa & Homestay</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0891b2] to-[#0ea5e9]">
                Vũng Tàu
              </span>
            </h2>
        
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

          {/* Label Pills - Đặc điểm nổi bật */}
          {labels.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
              <span className="text-sm text-[#0c4a6e]/70 font-medium">Đặc điểm:</span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {labels.map((label) => {
                  const isActive = selectedLabelIds.includes(label.id);
                  // Count properties with this label in current location+type filtered set (reactive!)
                  const baseFiltered = properties.filter((p: any) => {
                    const locationMatch = selectedLocation === 'all' || 
                      (p.locationName ? p.locationName === LOCATION_MAPPING[selectedLocation] : p.location === selectedLocation);
                    const typeMatch = selectedPropertyType === 'all' || p.propertyTypeName === selectedPropertyType;
                    return locationMatch && typeMatch;
                  });
                  const labelCount = baseFiltered.filter((p: any) => 
                    p.labels?.some((l: any) => l.id === label.id)
                  ).length;
                  
                  return (
                    <button
                      key={label.id}
                      onClick={() => handleLabelToggle(label.id)}
                      className={cn(
                        "px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 border-2",
                        isActive
                          ? "text-white shadow-md scale-105"
                          : "bg-white/60 hover:bg-white/80 text-[#0c4a6e]"
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
                        <span className={cn(
                          "px-1 sm:px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold",
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-[#0c4a6e]/10 text-[#0c4a6e]"
                        )}>
                          {labelCount}
                        </span>
                      </span>
                    </button>
                  );
                })}
                {selectedLabelIds.length > 0 && (
                  <button
                    onClick={() => setSelectedLabelIds([])}
                    className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200"
                  >
                    ✕ Xóa lọc
                  </button>
                )}
              </div>
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

        {/* Wave Divider SVG at Bottom - Smoother Transition to Locations */}
        <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden pointer-events-none">
          <svg 
            viewBox="0 0 1440 120" 
            preserveAspectRatio="none" 
            className="absolute bottom-0 w-full h-full opacity-60"
            fill="#f0f9ff"
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
          background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%)',
        }}
      >
        {/* Floating Accents */}
        <BubbleDecoration className="top-20 left-1/3" delay={0.5} size={20} />
        <BubbleDecoration className="top-1/2 right-1/4" delay={2.5} size={30} />
        <FloatingDecoration className="bottom-1/4 left-10" delay={4} size={50} />
        {/* Animated subtle light patterns */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
          <svg className="absolute -bottom-20 left-0 w-[200%] h-40" viewBox="0 0 2880 120" preserveAspectRatio="none">
            <path fill="#0891b2" d="M0,60 C480,120 960,0 1440,60 C1920,120 2400,0 2880,60 L2880,120 L0,120 Z">
              <animateTransform attributeName="transform" type="translate" values="0,0; -1440,0; 0,0" dur="25s" repeatCount="indefinite"/>
            </path>
          </svg>
        </div>

        {/* Floating subtle decorations */}
        <div className="absolute top-20 right-20 w-32 h-32 opacity-[0.03] pointer-events-none animate-pulse">
          <svg viewBox="0 0 100 100" fill="#0891b2">
            <path d="M50,10 C70,10 80,25 80,40 C80,55 65,70 50,90 C35,70 20,55 20,40 C20,25 30,10 50,10 M30,45 Q50,35 70,45 M35,55 Q50,45 65,55"/>
          </svg>
        </div>
        <div className="absolute bottom-40 left-16 w-24 h-24 opacity-[0.03] pointer-events-none" style={{ animation: 'warmFloat 4s ease-in-out infinite' }}>
          <svg viewBox="0 0 100 100" fill="#0891b2">
            <circle cx="50" cy="50" r="20"/>
            <path d="M50,25 L50,5 M75,50 L95,50 M50,75 L50,95 M25,50 L5,50"/>
          </svg>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] relative z-10">
          {/* Section Header - Premium White */}
          <div className="text-center mb-16 md:mb-20 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 rounded-full bg-white shadow-sm border border-cyan-100 animate-fade-in-up">
              <svg className="w-5 h-5 text-cyan-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              <span className="text-cyan-700 text-sm font-semibold tracking-wide uppercase">{t('favoriteDestinations')}</span>
            </div>
            <h2 
              id="locations-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up relative"
              style={{ animationDelay: '200ms' }}
            >
              <span 
                className="bg-gradient-to-r from-[#0c4a6e] via-[#0891b2] to-[#14b8a6] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x"
              >
                {t('bestAreas')}
              </span>
            </h2>
          </div>

          {/* Main Content Card - Premium Glassmorphism */}
          <div 
            className="relative rounded-2xl sm:rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden border border-slate-200"
            style={{
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)',
            }}
          >
            {/* Mobile: Image on top, Desktop: Side by side */}
            <div className="flex flex-col lg:flex-row">
              
              {/* Image Section - Shows first on mobile */}
              <div className="relative w-full h-[200px] sm:h-[280px] lg:h-[600px] lg:flex-1 lg:order-2 overflow-hidden">
                <div className="absolute inset-0 animate-slow-zoom">
                  <Image
                    src={showcaseLocations[showcaseIndex]?.showcaseImage}
                    alt={showcaseLocations[showcaseIndex]?.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-all duration-1000"
                    priority={showcaseIndex === 0}
                  />
                </div>
                
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/30 lg:bg-gradient-to-r lg:from-white/30 lg:via-transparent lg:to-transparent" />
                
                {/* Location Badge */}
                <div 
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-slate-200"
                  style={{ background: 'rgba(255,255,255,0.9)' }}
                >
                  <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-700 text-xs font-semibold">Vũng Tàu</span>
                </div>

                {/* Progress indicators - Mobile only */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 lg:hidden">
                  {showcaseLocations.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setShowcaseIndex(idx)}
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        showcaseIndex === idx ? "bg-white w-2.5" : "bg-white/60 w-1.5"
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 p-5 sm:p-6 md:p-10 lg:p-16 flex flex-col relative justify-center lg:order-1">
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
                            ? "bg-gradient-to-r from-[#0c4a6e] to-[#0891b2] text-white shadow-lg shadow-cyan-500/10 scale-105" 
                            : "bg-slate-100/80 text-slate-600 hover:bg-slate-200 border border-slate-200"
                        )}
                      >
                        <span className="flex items-center gap-1.5 sm:gap-2">
                          {location.name}
                          <span className={cn(
                            "px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold",
                            isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"
                          )}>
                            {count}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Content Area */}
                <div className="flex flex-col">
                  {/* Location Name with Icon */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#0c4a6e] transition-all duration-500"
                      style={{ fontFamily: 'var(--font-heading), "Playfair Display", serif' }}
                    >
                      {showcaseLocations[showcaseIndex]?.name}
                    </h3>
                  </div>
                  
                  {/* Description with subtle border */}
                  <div className="relative pl-4 sm:pl-6 mb-6 sm:mb-8 lg:mb-10">
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 sm:w-1 bg-cyan-200 rounded-full" />
                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base lg:text-lg min-h-[4.5rem] sm:min-h-[5rem] lg:min-h-[5.5rem] line-clamp-3">
                      {showcaseLocations[showcaseIndex]?.description}
                    </p>
                  </div>
                  
                  {/* Stats Cards - Responsive Grid */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-10">
                    <div 
                      className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-100"
                      style={{
                        background: 'white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                      }}
                    >
                      <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0c4a6e]">
                        {locationData[showcaseLocations[showcaseIndex]?.id]?.count || 0}
                      </span>
                      <span className="text-slate-500 text-xs sm:text-sm font-medium mt-1">Villa & Homestay</span>
                    </div>
                    <div 
                      className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-green-50"
                      style={{
                        background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                      }}
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-green-600 text-xs sm:text-sm font-bold">{tCommon('ready')}</span>
                      </span>
                    </div>
                  </div>
                  
                  {/* CTA and Navigation - Fixed for Mobile */}
                  <div className="flex items-center justify-between gap-3">
                    <Button 
                      asChild 
                      className="group relative overflow-hidden bg-gradient-to-r from-[#0c4a6e] to-[#0891b2] text-white font-bold rounded-full px-5 sm:px-8 py-3 sm:py-5 text-sm sm:text-base shadow-xl shadow-cyan-500/10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex-1"
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
                      </Link>
                    </Button>

                    {/* Navigation Controls - Always inline */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setShowcaseIndex(prev => prev === 0 ? showcaseLocations.length - 1 : prev - 1)}
                        className="group w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center hover:bg-slate-200 hover:scale-105 transition-all duration-300"
                        aria-label="Previous location"
                      >
                        <svg className="w-4 h-4 text-slate-600 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setShowcaseIndex(prev => prev === showcaseLocations.length - 1 ? 0 : prev + 1)}
                        className="group w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center hover:bg-slate-200 hover:scale-105 transition-all duration-300"
                        aria-label="Next location"
                      >
                        <svg className="w-4 h-4 text-slate-600 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom divider to next section - Seamless to Feedback top */}
        <div className="absolute -bottom-1 left-0 right-0 h-24 overflow-hidden pointer-events-none">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-full" fill="#e0f2fe">
            <path d="M0,50 C360,100 720,0 1080,50 L1440,50 L1440,100 L0,100 Z"/>
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

      {/* Recently Viewed - only shows if user has viewed properties */}
      <RecentlyViewedSection />

      <TrustSections />
      <FeedbackSection />
      <RequestAdviceSection />
      <FAQSection />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes warmFloat {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(15px, -20px) rotate(5deg); }
          100% { transform: translate(-10px, -40px) rotate(-5deg); }
        }
        @keyframes riseAndFade {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          20% { opacity: 0.1; }
          80% { opacity: 0.05; }
          100% { transform: translateY(-100px) scale(1.2); opacity: 0; }
        }
      `}} />
    </>
  );
}

