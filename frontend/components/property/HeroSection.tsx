'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface PropertyImage {
  imageUrl: string;
  displayOrder?: number;
}

interface HeroSectionProps {
  images: PropertyImage[];
  propertyName: string;
  onImageClick: (index: number) => void;
}

export function HeroSection({ images, propertyName, onImageClick }: HeroSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // Ensure we have at least one image
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[400px] md:h-[600px] bg-gradient-ocean-wave rounded-xl flex items-center justify-center">
        <p className="text-white text-lg">No images available</p>
      </div>
    );
  }

  // Get up to 6 images for the grid
  const displayImages = images.slice(0, 6);
  const hasMoreImages = images.length > 6;

  return (
    <section className="w-full">
      {/* Desktop and Tablet: 2x3 Grid */}
      <div className="hidden md:grid md:grid-cols-4 gap-2 h-[600px]">
        {/* Main image - spans 2 columns and 2 rows */}
        <div
          className="col-span-2 row-span-2 relative rounded-xl overflow-hidden cursor-pointer group"
          onClick={() => onImageClick(0)}
          onMouseEnter={() => setHoveredIndex(0)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <Image
            src={displayImages[0].imageUrl}
            alt={`${propertyName} - Main view`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
            quality={75}
          />
          {/* Ocean gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-ocean-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Secondary images - 4 smaller images in 2x2 grid */}
        {displayImages.slice(1, 5).map((image, idx) => {
          const imageIndex = idx + 1;
          const isLastImage = imageIndex === 4 && hasMoreImages;
          
          return (
            <div
              key={imageIndex}
              className="col-span-1 row-span-1 relative rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => onImageClick(imageIndex)}
              onMouseEnter={() => setHoveredIndex(imageIndex)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Image
                src={image.imageUrl}
                alt={`${propertyName} - View ${imageIndex + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                quality={75}
              />
              {/* Ocean gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-ocean-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* "View All Photos" button overlay on last image if more than 6 images */}
              {isLastImage && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-white/90 hover:bg-white text-navy-slate-900 font-semibold shadow-cool-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      onImageClick(imageIndex);
                    }}
                  >
                    View All {images.length} Photos
                  </Button>
                </div>
              )}
            </div>
          );
        })}

        {/* If we have exactly 5 images, show the 5th image */}
        {displayImages.length === 5 && (
          <div
            className="col-span-1 row-span-1 relative rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => onImageClick(4)}
            onMouseEnter={() => setHoveredIndex(4)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Image
              src={displayImages[4].imageUrl}
              alt={`${propertyName} - View 5`}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              quality={75}
            />
            {/* Ocean gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-ocean-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}

        {/* If we have 6 images and no more, show the 6th image normally */}
        {displayImages.length === 6 && !hasMoreImages && (
          <div
            className="col-span-1 row-span-1 relative rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => onImageClick(5)}
            onMouseEnter={() => setHoveredIndex(5)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Image
              src={displayImages[5].imageUrl}
              alt={`${propertyName} - View 6`}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              quality={75}
            />
            {/* Ocean gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-ocean-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}
      </div>

      {/* Tablet: 2 columns */}
      <div className="hidden sm:grid md:hidden grid-cols-2 gap-2 h-[400px]">
        {displayImages.slice(0, 4).map((image, idx) => {
          const isLastImage = idx === 3 && hasMoreImages;
          
          return (
            <div
              key={idx}
              className="relative rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => onImageClick(idx)}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Image
                src={image.imageUrl}
                alt={`${propertyName} - View ${idx + 1}`}
                fill
                sizes="50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority={idx === 0}
                quality={75}
              />
              {/* Ocean gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-ocean-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* "View All Photos" button overlay on last image if more than 6 images */}
              {isLastImage && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="default"
                    className="bg-white/90 hover:bg-white text-navy-slate-900 font-semibold shadow-cool-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      onImageClick(idx);
                    }}
                  >
                    View All {images.length} Photos
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: 1 column */}
      <div className="grid sm:hidden grid-cols-1 gap-2 h-[400px]">
        <div
          className="relative rounded-xl overflow-hidden cursor-pointer group h-full"
          onClick={() => onImageClick(0)}
          onMouseEnter={() => setHoveredIndex(0)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <Image
            src={displayImages[0].imageUrl}
            alt={`${propertyName} - Main view`}
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
            quality={75}
          />
          {/* Ocean gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-ocean-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* "View All Photos" button overlay if more than 1 image */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4">
              <Button
                variant="secondary"
                size="default"
                className="bg-white/90 hover:bg-white text-navy-slate-900 font-semibold shadow-cool-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onImageClick(0);
                }}
              >
                View All {images.length} Photos
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
