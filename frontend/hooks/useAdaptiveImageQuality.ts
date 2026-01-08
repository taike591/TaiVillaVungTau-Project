'use client';

import { useState, useEffect } from 'react';

/**
 * Adaptive Image Quality Hook
 * Returns optimal image quality based on viewport width:
 * - Mobile (< 768px): 60 - smaller screens need less detail
 * - Tablet (768-1024px): 70 - balanced
 * - Desktop (> 1024px): 80 - larger screens need more detail
 */
export function useAdaptiveImageQuality(): number {
  const [quality, setQuality] = useState(70); // default SSR value

  useEffect(() => {
    const updateQuality = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setQuality(60);  // mobile
      } else if (width < 1024) {
        setQuality(70);  // tablet
      } else {
        setQuality(80);  // desktop
      }
    };

    // Initial check
    updateQuality();

    // Listen for resize (debounced internally by most browsers)
    window.addEventListener('resize', updateQuality);
    return () => window.removeEventListener('resize', updateQuality);
  }, []);

  return quality;
}

/**
 * Get static quality for priority/LCP images
 * Use this for hero images that need to load fast
 */
export const LCP_IMAGE_QUALITY = 75;

/**
 * Get quality for thumbnail images
 */
export const THUMBNAIL_QUALITY = 50;
