'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports to reduce initial bundle size
const BrandIntroSlide = dynamic(() => import('./brand-intro-slide').then(mod => ({ default: mod.BrandIntroSlide })), {
  ssr: false, // Not needed on server
});

const HeroCarousel = dynamic(() => import('./hero-carousel').then(mod => ({ default: mod.HeroCarousel })), {
  loading: () => <div className="h-[100vh] bg-gradient-to-b from-slate-900 to-slate-800 animate-pulse" />,
  ssr: true,
});

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
    <section 
      className="relative" 
      aria-label="Hero section - Villa showcases" 
      suppressHydrationWarning
    >
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
        aria-hidden={!showCarousel}
      >
        <HeroCarousel villas={villas} />
      </div>
    </section>
  );
}
