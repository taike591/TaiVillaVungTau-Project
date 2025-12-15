'use client';

import { useState, useEffect } from 'react';
import { BrandIntroSlide } from './brand-intro-slide';
import { HeroCarousel } from './hero-carousel';

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
}

interface HeroSectionProps {
  villas: Villa[];
}

export function HeroSection({ villas }: HeroSectionProps) {
  const [showIntro, setShowIntro] = useState(true);
  const [showCarousel, setShowCarousel] = useState(false);

  useEffect(() => {
    // Check if user has already seen the intro in this session
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    
    if (hasSeenIntro) {
      setShowIntro(false);
      setShowCarousel(true);
    } else {
      // If not seen, keep showIntro=true (default) and wait for completion
    }
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem('hasSeenIntro', 'true');
    setShowIntro(false);
    // Small delay before showing carousel for smooth transition
    setTimeout(() => {
      setShowCarousel(true);
    }, 100);
  };

  return (
    <div className="relative" suppressHydrationWarning>
      {/* Brand Intro Slide - Shows first with auto-advance */}
      {showIntro && (
        <BrandIntroSlide 
          autoAdvanceDelay={5000} 
          onComplete={handleIntroComplete} 
        />
      )}
      
      {/* Hero Carousel - Fades in after intro completes */}
      <div 
        className={`transition-opacity duration-700 ease-in-out ${
          showCarousel ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <HeroCarousel villas={villas} />
      </div>
    </div>
  );
}
