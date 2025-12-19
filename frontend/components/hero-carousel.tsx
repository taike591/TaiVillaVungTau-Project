'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, MapPin, Play, Pause, Bed, Users } from 'lucide-react';
import { Button } from './ui/button';
import { WishlistButton } from './wishlist';
import { getMainImage } from '@/lib/error-handling';

interface PropertyImage {
  id: number;
  imageUrl: string;
  isThumbnail?: boolean;
}

interface Villa {
  id: number;
  name: string;
  code: string;
  description?: string;
  images?: PropertyImage[] | string[];
  area?: string;
  address?: string;
  bedroomCount?: number;
  maxGuests?: number;
  priceWeekday?: number;
  locationName?: string;
}

function getShortAddress(address?: string): string {
  if (!address) return '';
  const commaIndex = address.indexOf(',');
  return commaIndex > 0 ? address.substring(0, commaIndex).trim() : address.trim();
}

function formatPrice(price?: number): string {
  if (!price) return '';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price);
}

interface HeroCarouselProps {
  villas: Villa[];
}

export function HeroCarousel({ villas }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const t = useTranslations('common');
  const tHero = useTranslations('hero');
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<number>(0);

  const SLIDE_DURATION = 6000;

  // Progress animation
  useEffect(() => {
    if (!isAutoPlaying || villas.length === 0 || isHovered) {
      return;
    }

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress < 100) {
        progressRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentIndex((prev) => (prev + 1) % villas.length);
        setProgress(0);
      }
    };

    progressRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(progressRef.current);
  }, [isAutoPlaying, villas.length, currentIndex, isHovered]);

  const goToSlide = useCallback((index: number) => {
    if (index === currentIndex) return;
    setCurrentIndex(index);
    setProgress(0);
  }, [currentIndex]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + villas.length) % villas.length);
    setProgress(0);
  }, [villas.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % villas.length);
    setProgress(0);
  }, [villas.length]);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying((prev) => !prev);
    setProgress(0);
  }, []);

  if (villas.length === 0) return null;

  const currentVilla = villas[currentIndex];
  const currentImage = getMainImage(currentVilla.images);
  const backgroundImage = currentImage || 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1920&q=80';

  return (
    <div 
      ref={containerRef} 
      className="relative h-screen w-full overflow-hidden bg-slate-900"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      suppressHydrationWarning
    >
      {/* Background Images with Ken Burns Effect */}
      {villas.slice(0, 5).map((villa, index) => {
        const image = getMainImage(villa.images) || backgroundImage;
        const isActive = index === currentIndex;
        
        return (
          <div
            key={villa.id}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              opacity: isActive ? 1 : 0,
              zIndex: isActive ? 1 : 0,
            }}
            suppressHydrationWarning
          >
            <Image
              src={image}
              alt={villa.name}
              fill
              sizes="100vw"
              priority={index === 0 || index === 1}
              loading={index <= 1 ? "eager" : "lazy"}
              quality={80}
              className={`object-cover ${isActive ? 'animate-ken-burns' : ''}`}
            />
          </div>
        );
      })}

      {/* Gradient Overlays - Lighter for clearer image */}
      <div className="absolute inset-0 z-[2]" suppressHydrationWarning>
        {/* Bottom gradient for content readability - reduced opacity */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" suppressHydrationWarning />
        {/* Top gradient for navbar - lighter */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" suppressHydrationWarning />
        {/* Side gradient for thumbnails - lighter */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/30 via-transparent to-transparent hidden lg:block" suppressHydrationWarning />
        {/* Animated color overlay - reduced opacity */}
        <div 
          className="absolute inset-0 opacity-15 mix-blend-overlay"
          style={{
            background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 50%, #0891b2 100%)',
          }}
          suppressHydrationWarning
        />
      </div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden" suppressHydrationWarning>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/20"
            style={{
              width: `${3 + (i % 4) * 2}px`,
              height: `${3 + (i % 4) * 2}px`,
              left: `${5 + i * 8}%`,
              animation: `floatParticle ${10 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.7}s`,
            }}
            suppressHydrationWarning
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="absolute inset-0 z-[15] flex items-end pointer-events-none" suppressHydrationWarning>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-28 sm:pb-28 lg:pb-28" suppressHydrationWarning>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8" suppressHydrationWarning>
            {/* Left Content */}
            <div className="flex-1 max-w-3xl pointer-events-none" suppressHydrationWarning>
              {/* Location Badge + Villa Code - Same Row */}
              <div 
                key={`badges-${currentIndex}`}
                className="flex flex-wrap items-center gap-3 mb-6 animate-fade-in-up"
                suppressHydrationWarning
              >
                {/* Location Badge */}
                <div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
                  suppressHydrationWarning
                >
                  <MapPin className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm font-medium text-white/90">
                    {currentVilla.locationName || 'Vũng Tàu, Vietnam'}
                  </span>
                </div>

                {/* Villa Code */}
                <div 
                  className="inline-flex items-center px-3 py-2 rounded-full bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/30"
                  suppressHydrationWarning
                >
                  <span className="text-cyan-300 text-sm font-bold tracking-wider">
                    {currentVilla.code}
                  </span>
                </div>
              </div>

              {/* Villa Name - Premium Typography */}
              <h1 
                key={`name-${currentIndex}`}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 leading-tight uppercase tracking-tight animate-fade-in-up"
                style={{ 
                  animationDelay: '150ms',
                  textShadow: '0 2px 10px rgba(14, 165, 233, 0.4), 0 4px 20px rgba(20, 184, 166, 0.3), 0 8px 40px rgba(0,0,0,0.5)',
                  fontFamily: 'var(--font-heading), "Playfair Display", serif',
                  letterSpacing: '-0.02em',
                }}
              >
                {currentVilla.name}
              </h1>

              {/* Address */}
              {currentVilla.address && (
                <div 
                  key={`addr-${currentIndex}`}
                  className="flex items-center gap-2 text-white/70 mb-4 animate-fade-in-up"
                  style={{ animationDelay: '200ms' }}
                  suppressHydrationWarning
                >
                  <MapPin className="h-4 w-4 text-teal-400 shrink-0" />
                  <span className="text-sm sm:text-base">{getShortAddress(currentVilla.address)}</span>
                </div>
              )}

              {/* Property Stats */}
              <div 
                key={`stats-${currentIndex}`}
                className="flex flex-wrap items-center gap-4 mb-6 animate-fade-in-up"
                style={{ animationDelay: '250ms' }}
                suppressHydrationWarning
              >
                {currentVilla.bedroomCount && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm" suppressHydrationWarning>
                    <Bed className="h-4 w-4 text-cyan-400" />
                    <span className="text-white text-sm font-medium">{currentVilla.bedroomCount} {t('beds')}</span>
                  </div>
                )}
                {currentVilla.maxGuests && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm" suppressHydrationWarning>
                    <Users className="h-4 w-4 text-teal-400" />
                    <span className="text-white text-sm font-medium">{currentVilla.maxGuests} {t('guests')}</span>
                  </div>
                )}
                {currentVilla.priceWeekday && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/20 backdrop-blur-sm border border-amber-400/30" suppressHydrationWarning>
                    <span className="text-amber-300 text-sm font-bold">{formatPrice(currentVilla.priceWeekday)}/{t('perNight')}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p 
                key={`desc-${currentIndex}`}
                className="text-white/80 text-sm sm:text-base max-w-xl mb-8 leading-relaxed line-clamp-2 animate-fade-in-up"
                style={{ animationDelay: '300ms' }}
              >
                {currentVilla.description || tHero('discoverVacation')}
              </p>

              {/* Action Buttons */}
              <div 
                className="flex items-center gap-4 animate-fade-in-up pointer-events-auto"
                style={{ animationDelay: '350ms' }}
                suppressHydrationWarning
              >
                <Button
                  asChild
                  size="lg"
                  className="group relative overflow-hidden bg-white text-slate-900 hover:bg-white rounded-full px-8 py-6 font-bold text-base shadow-2xl shadow-white/20 transition-all duration-300 hover:scale-105 hover:shadow-white/30"
                >
                  <Link href={`/properties/${currentVilla.id}`} suppressHydrationWarning>
                    <span className="relative z-10 flex items-center gap-2">
                      {t('viewDetails')}
                      <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-cyan-100 to-teal-100 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" suppressHydrationWarning />
                  </Link>
                </Button>
                
                
                <WishlistButton
                  property={{
                    id: currentVilla.id,
                    code: currentVilla.code,
                    name: currentVilla.name,
                    image: currentImage || '',
                    priceWeekday: currentVilla.priceWeekday || 0,
                    bedroomCount: currentVilla.bedroomCount || 0,
                  }}
                  size="lg"
                  className="!w-14 !h-14 !bg-white/10 !backdrop-blur-md !border !border-white/20 hover:!bg-white/20"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Thumbnail Navigation - Positioned Independently */}
      <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 z-[60]" suppressHydrationWarning>
        <div className="flex flex-col gap-3" suppressHydrationWarning>
          {villas.slice(0, 5).map((villa, index) => {
            const isActive = index === currentIndex;
            const thumbImage = getMainImage(villa.images) || backgroundImage;
            
            return (
              <button
                key={villa.id}
                onClick={() => goToSlide(index)}
                className={`group relative w-44 h-28 rounded-2xl overflow-hidden transition-all duration-500 ${
                  isActive 
                    ? 'scale-105 ring-2 ring-cyan-400 ring-offset-2 ring-offset-transparent shadow-2xl shadow-cyan-500/30' 
                    : 'opacity-60 hover:opacity-100 hover:scale-102'
                }`}
                suppressHydrationWarning
              >
                {/* Thumbnail Image - Optimized with Next.js Image */}
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110" suppressHydrationWarning>
                  <Image
                    src={thumbImage}
                    alt={villa.name}
                    fill
                    sizes="(max-width: 1024px) 0vw, 176px"
                    quality={60}
                    className="object-cover"
                    suppressHydrationWarning
                  />
                </div>
                
                {/* Overlay */}
                <div className={`absolute inset-0 transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-t from-cyan-900/80 via-transparent to-transparent' 
                    : 'bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80'
                }`} suppressHydrationWarning />
                
                {/* Content */}
                <div className="absolute inset-0 p-3 flex flex-col justify-end" suppressHydrationWarning>
                  <div className="flex items-center gap-1 mb-1" suppressHydrationWarning>
                    <MapPin className="h-3 w-3 text-cyan-400" />
                    <span className="text-[10px] text-white/80 font-medium">
                      {villa.locationName || 'Vũng Tàu'}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white line-clamp-1">
                    {villa.name.split(' ').slice(0, 3).join(' ')}
                  </p>
                </div>
                
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute top-2 right-2" suppressHydrationWarning>
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-lg shadow-cyan-400/50" suppressHydrationWarning />
                  </div>
                )}
                
                {/* Progress bar for active thumbnail */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20" suppressHydrationWarning>
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-teal-400 transition-all duration-100"
                      style={{ width: `${progress}%` }}
                      suppressHydrationWarning
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls - Compact */}
      <div className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none" suppressHydrationWarning>
        <button
          onClick={goToPrevious}
          className="group w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center hover:bg-white/25 hover:scale-105 transition-all duration-300 pointer-events-auto"
          aria-label={tHero('previousSlide')}
          suppressHydrationWarning
        >
          <ChevronLeft className="h-4 w-4 text-white group-hover:-translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Scroll Down Indicator - Premium Accent */}
      <div 
        className="absolute bottom-4 sm:bottom-6 right-8 sm:right-12 hidden lg:flex flex-col items-center gap-3 z-10 animate-fade-in pointer-events-none"
        style={{ animationDelay: '1000ms' }}
        suppressHydrationWarning
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-medium vertical-text">
          Scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-cyan-400 animate-scroll-line" />
        </div>
      </div>
      
      <div className="absolute right-2 sm:right-3 lg:right-52 top-1/2 -translate-y-1/2 z-10 pointer-events-none" suppressHydrationWarning>
        <button
          onClick={goToNext}
          className="group w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center hover:bg-white/25 hover:scale-105 transition-all duration-300 pointer-events-auto"
          aria-label={tHero('nextSlide')}
          suppressHydrationWarning
        >
          <ChevronRight className="h-4 w-4 text-white group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Bottom Controls - Compact for Mobile */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 sm:gap-3" suppressHydrationWarning>
        {/* Slide Counter - Compact on mobile, showing current/total */}
        <div className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20" suppressHydrationWarning>
          <span className="text-white text-[10px] sm:text-sm font-medium">
            {String(currentIndex + 1).padStart(2, '0')} / {String(villas.length).padStart(2, '0')}
          </span>
        </div>

        {/* Progress Bar - simpler on mobile instead of dots */}
        <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20" suppressHydrationWarning>
          {villas.slice(0, 5).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-6 sm:w-8 bg-cyan-400' : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={tHero('goToSlide', { num: index + 1 })}
              suppressHydrationWarning
            >
              {index === currentIndex && (
                <span 
                  className="absolute inset-0 rounded-full bg-white/50"
                  style={{ 
                    width: `${progress}%`,
                    transition: 'width 100ms linear'
                  }}
                  suppressHydrationWarning
                />
              )}
            </button>
          ))}
          {villas.length > 5 && (
            <span className="text-white/60 text-xs">+{villas.length - 5}</span>
          )}
        </div>

        {/* Mobile Progress Bar - Single bar instead of dots */}
        <div className="flex sm:hidden items-center px-2 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 w-16" suppressHydrationWarning>
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-400 transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex + 1) / villas.length) * 100}%` }}
              suppressHydrationWarning
            />
          </div>
        </div>
        
        {/* Play/Pause Button */}
        <button
          onClick={toggleAutoPlay}
          className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300"
          aria-label={isAutoPlaying ? tHero('pause') : tHero('play')}
          suppressHydrationWarning
        >
          {isAutoPlaying ? (
            <Pause className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
          ) : (
            <Play className="h-3 w-3 sm:h-4 sm:w-4 text-white ml-0.5" />
          )}
        </button>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes kenBurns {
          0% { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.1) translate(-1%, -1%); }
        }
        
        @keyframes floatParticle {
          0%, 100% { 
            transform: translateY(100vh) translateX(0);
            opacity: 0;
          }
          10% { opacity: 0.5; }
          50% { 
            transform: translateY(50vh) translateX(20px);
            opacity: 0.3;
          }
          90% { opacity: 0.5; }
          100% { 
            transform: translateY(-10vh) translateX(-10px);
            opacity: 0;
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
