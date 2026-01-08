'use client';

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageGallery, GalleryGrid } from "@/components/property/ImageGallery";
import { PropertyDetailPricingCard } from "@/components/property/PropertyDetailPricingCard";
import { WishlistButton } from "@/components/wishlist";
import { 
  MapPin, Users, Bed, Bath, Home, ChevronRight, 
  Share2, FileText, Star, Waves, Droplets,
  Wifi, Car, Utensils, Wind, Tv, Coffee
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { sortImagesWithThumbnailFirst, getMainImage } from "@/lib/error-handling";

// Amenity icon mapping
const AMENITY_ICONS: Record<string, any> = {
  'Wifi': Wifi,
  'Bãi đỗ xe': Car,
  'Bếp đầy đủ': Utensils,
  'Điều hòa': Wind,
  'TV': Tv,
  'Máy pha cà phê': Coffee,
  'Hồ bơi': Waves,
};

// Intersection Observer hook for scroll animations
function useIntersectionObserver(options = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// Animated Section Component
function AnimatedSection({ children, className, delay = 0 }: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) {
  const { ref, isVisible } = useIntersectionObserver();
  
  return (
    <div 
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-8",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

interface PropertyDetailClientProps {
  property: any;
}

export function PropertyDetailClient({ property }: PropertyDetailClientProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        {/* Breadcrumb & Header */}
        <section className="bg-white border-b border-slate-100">
          <div className="container mx-auto px-4 py-4">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <Link href="/" className="hover:text-[#0891b2] transition-colors flex items-center gap-1">
                <Home className="w-4 h-4" />
                Trang chủ
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/properties" className="hover:text-[#0891b2] transition-colors">
                Danh sách Villa
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-800 font-medium">{property.code} - {property.name}</span>
            </nav>

            {/* Title Row */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 mb-3">
                  {property.name}
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-[#0891b2] hover:bg-[#0891b2] text-white font-semibold">
                    {property.code}
                  </Badge>
                  {property.status === 'ACTIVE' && (
                    <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                      Đang hoạt động
                    </Badge>
                  )}
                  <span className="flex items-center text-slate-500 text-sm">
                    <MapPin className="h-4 w-4 mr-1 text-red-500" />
                    {property.locationName ? `${property.locationName} - ` : ''}
                    {property.address || property.area}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <WishlistButton
                  property={{
                    id: property.id,
                    code: property.code,
                    name: property.name,
                    image: getMainImage(property.images) || '',
                    priceWeekday: property.priceWeekday,
                    bedroomCount: property.bedroomCount,
                  }}
                  size="md"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full w-10 h-10"
                  onClick={async () => {
                    const shareData = {
                      title: property.name,
                      text: `${property.name} - ${property.code} | Tài Villa Vũng Tàu`,
                      url: window.location.href,
                    };
                    
                    try {
                      if (navigator.share) {
                        await navigator.share(shareData);
                      } else {
                        await navigator.clipboard.writeText(window.location.href);
                        alert('Đã sao chép link vào clipboard!');
                      }
                    } catch (err) {
                      console.log('Share cancelled or failed:', err);
                    }
                  }}
                >
                  <Share2 className="w-5 h-5 text-slate-400" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Image Gallery Section */}
        <section className="container mx-auto px-4 py-3">
          <GalleryGrid 
            images={sortImagesWithThumbnailFirst(property.images)} 
            propertyName={property.name}
            onImageClick={handleImageClick}
            facebookLink={property.facebookLink}
          />
        </section>

        {/* Image Gallery Modal */}
        {galleryOpen && property.images && (
          <ImageGallery
            images={sortImagesWithThumbnailFirst(property.images)}
            initialIndex={galleryIndex}
            onClose={() => setGalleryOpen(false)}
          />
        )}

        {/* Property Stats */}
        <section className="container mx-auto px-4 pb-3">
          <Card className="p-3 md:p-4 bg-white border-0 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 md:gap-8">
              <div className="flex items-center gap-3 group cursor-default">
                <div className="w-12 h-12 rounded-xl bg-[#e0f2fe] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Bed className="h-6 w-6 text-[#0891b2]" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Phòng ngủ</p>
                  <p className="text-xl font-bold text-slate-800">{property.bedroomCount} Phòng</p>
                </div>
              </div>
              
              {property.bedCount !== undefined && (
                <div className="flex items-center gap-3 group cursor-default">
                  <div className="w-12 h-12 rounded-xl bg-[#e0f2fe] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Bed className="h-6 w-6 text-[#0891b2]" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Giường</p>
                    <p className="text-xl font-bold text-slate-800">{property.bedCount} Giường</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3 group cursor-default">
                <div className="w-12 h-12 rounded-xl bg-[#e0f2fe] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-[#0891b2]" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Sức chứa</p>
                  <p className="text-xl font-bold text-slate-800">{property.standardGuests}-{property.maxGuests} Khách</p>
                </div>
              </div>

              <div className="flex items-center gap-3 group cursor-default">
                <div className="w-12 h-12 rounded-xl bg-[#e0f2fe] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Bath className="h-6 w-6 text-[#0891b2]" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">WC</p>
                  <p className="text-xl font-bold text-slate-800">{property.bathroomCount} Phòng</p>
                </div>
              </div>

              {property.poolArea && (
                <div className="flex items-center gap-3 group cursor-default">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Droplets className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Hồ bơi</p>
                    <p className="text-xl font-bold text-slate-800">{property.poolArea}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </section>

        {/* Main Content Grid */}
        <section className="container mx-auto px-4 pb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - Details */}
            <div className="flex-1 space-y-4">
              {/* Description */}
              <AnimatedSection>
                <Card className="p-4 bg-white border-0 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-[#0891b2]" />
                    <h2 className="text-lg font-bold text-slate-800">Mô tả</h2>
                  </div>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm">
                    {property.description}
                  </p>
                  
                  {/* Hardcoded Additional Info */}
                  <div className="mt-3 pt-3 border-t border-slate-100 text-sm text-slate-600 space-y-1">
                    <p>📍 Nằm ngay khu vực du lịch sầm uất, đi ra Bãi Trước hay Bãi Sau đều rất thuận tiện và nhanh chóng.</p>
                    <p>🍳 Đầy đủ dụng cụ nhà bếp và các gia vị cơ bản (nồi, chảo, ly, chén bát...), máy giặt, tủ lạnh, ấm siêu tốc, máy sấy tóc...</p>
                    <p>🚗 Có chỗ đậu cho các loại xe.</p>
                  </div>
                  
                  {property.bedConfig && (
                    <div className="mt-3 p-3 bg-[#e0f2fe] rounded-lg">
                      <p className="font-semibold text-[#0c4a6e] text-sm mb-1">Cấu hình giường:</p>
                      <p className="text-[#0369a1] text-sm">{property.bedConfig}</p>
                    </div>
                  )}
                </Card>
              </AnimatedSection>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <AnimatedSection delay={100}>
                  <Card className="p-4 bg-white border-0 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-5 h-5 text-[#0891b2]" />
                      <h2 className="text-lg font-bold text-slate-800">Tiện ích</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {property.amenities.map((amenity: any, index: number) => {
                        const IconComponent = AMENITY_ICONS[amenity.name] || Star;
                        return (
                          <div 
                            key={amenity.id}
                            className={cn(
                              "flex items-center gap-2 p-2 rounded-lg",
                              "bg-slate-50 hover:bg-[#e0f2fe]",
                              "transition-all duration-300 cursor-default"
                            )}
                          >
                            <div className="w-6 h-6 rounded bg-white flex items-center justify-center shadow-sm">
                              <IconComponent className="w-3 h-3 text-[#0891b2]" />
                            </div>
                            <span className="text-xs font-medium text-slate-700">{amenity.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </AnimatedSection>
              )}

              {/* Map Location */}
              {property.mapUrl && (
                <AnimatedSection delay={200}>
                  <Card className="p-4 bg-white border-0 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-5 h-5 text-[#0891b2]" />
                      <h2 className="text-lg font-bold text-slate-800">Vị trí</h2>
                    </div>
                    <div className="relative h-48 md:h-64 rounded-lg overflow-hidden bg-slate-100">
                      <iframe
                        src={property.mapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="absolute inset-0"
                      />
                      {/* Overlay button */}
                      <a 
                        href={property.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 
                          flex items-center gap-2 px-4 py-2 
                          bg-white rounded-full shadow-lg
                          text-sm font-medium text-slate-700
                          hover:bg-slate-50 transition-colors"
                      >
                        <MapPin className="w-4 h-4 text-red-500" />
                        Xem vị trí trên bản đồ
                      </a>
                    </div>
                  </Card>
                </AnimatedSection>
              )}
            </div>

            {/* Right Column - Pricing Card */}
            <aside className="lg:w-[380px] shrink-0">
              <div className="sticky top-20">
                <PropertyDetailPricingCard
                  weekdayPrice={property.priceWeekday}
                  weekendPrice={property.priceWeekend}
                  standardGuests={property.standardGuests}
                  maxGuests={property.maxGuests}
                  priceNote={property.priceNote}
                  distanceToSea={property.distanceToSea}
                  facebookLink={property.facebookLink}
                />
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
