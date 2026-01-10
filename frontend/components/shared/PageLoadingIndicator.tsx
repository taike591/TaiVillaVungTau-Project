'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * Global Page Loading Indicator
 * Shows a top progress bar and optional overlay spinner during page transitions
 */
export function PageLoadingIndicator() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Track route changes
  useEffect(() => {
    // When route changes complete, hide loading
    setIsLoading(false);
    setProgress(100);
    
    // Reset progress after animation
    const timeout = setTimeout(() => {
      setProgress(0);
    }, 300);
    
    return () => clearTimeout(timeout);
  }, [pathname, searchParams]);

  // Don't render anything if not loading and progress is 0
  if (!isLoading && progress === 0) return null;

  return (
    <>
      {/* Top Progress Bar */}
      <div 
        className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-transparent"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 transition-all duration-300 ease-out shadow-lg shadow-cyan-500/50"
          style={{ 
            width: `${progress}%`,
            opacity: progress > 0 && progress < 100 ? 1 : 0,
          }}
        />
      </div>
    </>
  );
}

/**
 * Hook to trigger page loading state
 * Use this when navigating programmatically
 */
export function usePageLoading() {
  const [isNavigating, setIsNavigating] = useState(false);

  const startLoading = useCallback(() => {
    setIsNavigating(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsNavigating(false);
  }, []);

  return { isNavigating, startLoading, stopLoading };
}
