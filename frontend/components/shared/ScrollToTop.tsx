'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScrollToTopProps {
  /** Scroll threshold to show button (in pixels) */
  threshold?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Enhanced Scroll Navigation Component
 * 
 * Features:
 * - Show "Scroll to Top" when user scrolls down
 * - Remember last scroll position
 * - Show "Back to position" button after scrolling to top
 * - Premium glassmorphism design
 * - Smooth animations
 * - Fixed touch event issues on Android devices
 */
export function ScrollToTop({ threshold = 300, className }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [savedPosition, setSavedPosition] = useState<number | null>(null);
  const [showBackButton, setShowBackButton] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const currentScroll = window.scrollY;
      
      if (currentScroll > threshold) {
        setIsVisible(true);
        // Hide back button when user scrolls down again
        if (showBackButton && currentScroll > 100) {
          setShowBackButton(false);
          setSavedPosition(null);
        }
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, [threshold, showBackButton]);

  const scrollToTop = useCallback(() => {
    // Save current position before scrolling
    const currentPos = window.scrollY;
    if (currentPos > threshold) {
      setSavedPosition(currentPos);
    }
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    
    // Show back button after a short delay
    setTimeout(() => {
      if (currentPos > threshold) {
        setShowBackButton(true);
      }
    }, 500);
  }, [threshold]);

  const scrollToSavedPosition = useCallback(() => {
    if (savedPosition !== null) {
      window.scrollTo({
        top: savedPosition,
        behavior: 'smooth',
      });
      setShowBackButton(false);
      setSavedPosition(null);
    }
  }, [savedPosition]);

  // Don't render if neither button should be shown
  if (!isVisible && !showBackButton) return null;

  return (
    <>
      {/* Back to Position Button - Rendered as sibling, not nested */}
      {showBackButton && savedPosition !== null && (
        <button
          onClick={scrollToSavedPosition}
          onTouchEnd={(e) => {
            e.preventDefault();
            scrollToSavedPosition();
          }}
          aria-label="Quay lại vị trí cũ"
          className={cn(
            // Fixed positioning - center bottom (same as Scroll to Top)
            'fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50',
            // Base styles
            'flex items-center justify-center gap-2',
            'p-3.5 sm:px-5 sm:py-3 rounded-full',
            // Solid background for better touch on Android
            'bg-white',
            'border border-slate-200',
            'shadow-lg',
            // Text
            'text-slate-700 text-sm font-medium',
            // Hover effects (desktop only)
            'hover:bg-slate-50 hover:shadow-xl hover:border-cyan-300',
            'hover:text-cyan-600',
            // Touch feedback
            'active:scale-95 active:bg-slate-100',
            // Transitions
            'transition-all duration-200 ease-out',
            // Entrance animation
            'animate-in fade-in-0 slide-in-from-bottom-4 duration-300',
            // Ensure touch works
            'touch-manipulation',
            'select-none',
            className
          )}
        >
          <ArrowDown className="h-5 w-5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Quay lại</span>
        </button>
      )}

      {/* Scroll to Top Button */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          onTouchEnd={(e) => {
            e.preventDefault();
            scrollToTop();
          }}
          aria-label="Cuộn lên đầu trang"
          className={cn(
            // Fixed positioning - center bottom
            'fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50',
            // Base styles - circle on mobile, pill on desktop
            'flex items-center justify-center',
            // Mobile: circle with equal padding
            'p-3.5 sm:px-5 sm:py-3',
            'rounded-full',
            // Premium gradient background
            'bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500',
            // Shadow with color
            'shadow-lg shadow-teal-500/30',
            // Text
            'text-white text-sm font-semibold',
            // Hover effects (desktop only)
            'hover:shadow-xl hover:shadow-teal-500/40',
            'hover:scale-105',
            // Touch feedback - more responsive
            'active:scale-95 active:brightness-90',
            // Transitions
            'transition-all duration-200 ease-out',
            // Entrance animation
            'animate-in fade-in-0 slide-in-from-bottom-4 duration-300',
            // Ensure touch works on all devices
            'touch-manipulation',
            'select-none',
            // Prevent any text selection or context menu
            '-webkit-tap-highlight-color-transparent',
            className
          )}
        >
          <ArrowUp className="h-5 w-5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline sm:ml-2">Lên đầu</span>
        </button>
      )}
    </>
  );
}
