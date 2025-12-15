'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: (string | { imageUrl: string })[];
  initialIndex?: number;
  onClose: () => void;
}

function getImageUrl(img: string | { imageUrl: string }): string {
  return typeof img === 'string' ? img : img?.imageUrl;
}

export function ImageGallery({ images, initialIndex = 0, onClose }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isZoomed, setIsZoomed] = useState(false);
  
  // Touch swipe state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowLeft' && !isZoomed) {
        handlePrevious();
      } else if (e.key === 'ArrowRight' && !isZoomed) {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, onClose, isZoomed]);

  // Prevent body scroll when gallery is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handlePrevious = useCallback(() => {
    if (isAnimating || isZoomed) return;
    setDirection('left');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      setIsAnimating(false);
    }, 150);
  }, [isAnimating, isZoomed, images.length]);

  const handleNext = useCallback(() => {
    if (isAnimating || isZoomed) return;
    setDirection('right');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      setIsAnimating(false);
    }, 150);
  }, [isAnimating, isZoomed, images.length]);

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    if (isZoomed) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (isZoomed) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || isZoomed) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Double tap to zoom
  const lastTap = React.useRef<number>(0);
  const handleImageClick = (e: React.MouseEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      // Double tap - toggle zoom
      setIsZoomed(!isZoomed);
    }
    lastTap.current = now;
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      if (isZoomed) {
        setIsZoomed(false);
      } else {
        onClose();
      }
    }
  };

  const handleThumbnailClick = (index: number) => {
    if (index === currentIndex || isAnimating) return;
    setIsZoomed(false);
    setDirection(index > currentIndex ? 'right' : 'left');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsAnimating(false);
    }, 150);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col animate-fade-in"
      onClick={handleBackdropClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/50">
        {/* Image counter */}
        <div className="text-white text-sm bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm flex items-center gap-2">
          <span>{currentIndex + 1} / {images.length}</span>
          {isZoomed && (
            <span className="text-xs bg-cyan-500/80 px-2 py-0.5 rounded">Zoomed</span>
          )}
        </div>
        
        {/* Zoom hint */}
        <div className="hidden md:flex text-white/60 text-xs items-center gap-1">
          <span>Double-click to zoom</span>
        </div>
        
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 rounded-full"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Main Image Area */}
      <div 
        className="flex-1 relative flex items-center justify-center px-4 md:px-16"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Previous button */}
        {images.length > 1 && !isZoomed && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute left-2 md:left-4 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full",
              "bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm",
              "transition-all duration-300 hover:scale-110"
            )}
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
          </Button>
        )}

        {/* Image with slide animation and zoom */}
        <div 
          className={cn(
            "relative w-full h-full flex items-center justify-center overflow-hidden cursor-pointer",
            isZoomed && "overflow-auto"
          )}
          onClick={handleImageClick}
        >
          <div 
            className={cn(
              "relative transition-all duration-300 ease-out",
              isZoomed ? "w-[150%] h-[150%] cursor-zoom-out" : "w-full h-full cursor-zoom-in",
              isAnimating && direction === 'right' && "opacity-0 translate-x-8",
              isAnimating && direction === 'left' && "opacity-0 -translate-x-8",
              !isAnimating && "opacity-100 translate-x-0"
            )}
          >
            <Image
              src={getImageUrl(images[currentIndex])}
              alt={`Image ${currentIndex + 1}`}
              fill
              sizes={isZoomed ? "150vw" : "100vw"}
              className={cn(
                "transition-transform duration-300",
                isZoomed ? "object-contain scale-150" : "object-contain"
              )}
              priority
              quality={90}
              draggable={false}
            />
          </div>
        </div>

        {/* Next button */}
        {images.length > 1 && !isZoomed && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute right-2 md:right-4 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full",
              "bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm",
              "transition-all duration-300 hover:scale-110"
            )}
            onClick={handleNext}
          >
            <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
          </Button>
        )}
        
        {/* Swipe hint on mobile */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:hidden text-white/50 text-xs">
          Swipe to navigate • Double-tap to zoom
        </div>
      </div>

      {/* Thumbnail Strip */}
      {!isZoomed && (
        <div className="bg-black/50 backdrop-blur-sm py-4 px-4">
          <div className="flex justify-center gap-2 overflow-x-auto max-w-4xl mx-auto">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => handleThumbnailClick(idx)}
                className={cn(
                  "relative w-14 h-14 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0",
                  "transition-all duration-300",
                  idx === currentIndex 
                    ? "ring-2 ring-white scale-105" 
                    : "opacity-50 hover:opacity-80 hover:scale-105"
                )}
              >
                <Image
                  src={getImageUrl(img)}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Gallery Grid Component for the detail page
interface GalleryGridProps {
  images: (string | { imageUrl: string })[];
  propertyName: string;
  onImageClick: (index: number) => void;
}

export function GalleryGrid({ images, propertyName, onImageClick }: GalleryGridProps) {
  if (!images || images.length === 0) return null;

  const displayImages = images.slice(0, 5);
  const remainingCount = images.length - 5;

  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
      {/* Main large image */}
      <div 
        className="col-span-4 md:col-span-2 row-span-2 relative group cursor-pointer overflow-hidden"
        onClick={() => onImageClick(0)}
      >
        <img 
          src={getImageUrl(displayImages[0])} 
          alt={propertyName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300">
            <ZoomIn className="w-6 h-6 text-slate-700" />
          </div>
        </div>
      </div>

      {/* Small images grid */}
      {displayImages.slice(1, 5).map((img, idx) => (
        <div 
          key={idx}
          className="hidden md:block col-span-1 row-span-1 relative group cursor-pointer overflow-hidden"
          onClick={() => onImageClick(idx + 1)}
        >
          <img 
            src={getImageUrl(img)} 
            alt={`${propertyName} ${idx + 2}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300">
              <ZoomIn className="w-4 h-4 text-slate-700" />
            </div>
          </div>

          {/* "View all" overlay on last image */}
          {idx === 3 && remainingCount > 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <ZoomIn className="w-4 h-4" />
                  <span className="font-semibold">Xem tất cả ảnh</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Mobile: Show all button */}
      <div className="md:hidden col-span-4 flex justify-center py-2">
        <button 
          onClick={() => onImageClick(0)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
          Xem tất cả {images.length} ảnh
        </button>
      </div>
    </div>
  );
}
