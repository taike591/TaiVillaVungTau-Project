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
    <div 
      className={cn(
        // Container positioning - center bottom using transform
        'fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-40',
        // Flex container for buttons
        'flex items-center justify-center gap-2 sm:gap-3',
        // Prevent blocking page interactions
        'pointer-events-none',
        className
      )}
    >
      {/* Back to Position Button */}
      {showBackButton && savedPosition !== null && (
        <button
          onClick={scrollToSavedPosition}
          aria-label="Quay lại vị trí cũ"
          className={cn(
            // Base styles - same size as main button
            'group relative flex items-center justify-center gap-2 pointer-events-auto',
            'p-3.5 sm:px-5 sm:py-3 rounded-full',
            // Glassmorphism effect
            'bg-white/90 backdrop-blur-md',
            'border border-slate-200/60',
            'shadow-lg shadow-slate-200/50',
            // Text
            'text-slate-700 text-sm font-medium',
            // Hover effects
            'hover:bg-white hover:shadow-xl hover:border-cyan-300',
            'hover:text-cyan-600',
            // Transitions
            'transition-all duration-300 ease-out',
            // Entrance animation
            'animate-in fade-in-0 slide-in-from-bottom-4 duration-300'
          )}
        >
          <ArrowDown className="h-5 w-5 sm:h-4 sm:w-4 group-hover:translate-y-0.5 transition-transform" />
          <span className="hidden sm:inline">Quay lại</span>
        </button>
      )}

      {/* Scroll to Top Button */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          aria-label="Cuộn lên đầu trang"
          className={cn(
            // Base styles - circle on mobile, pill on desktop
            'group relative flex items-center justify-center pointer-events-auto',
            // Mobile: circle with equal padding
            'p-3.5 sm:px-5 sm:py-3',
            'rounded-full',
            // Premium gradient background
            'bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500',
            // Shadow with color
            'shadow-lg shadow-teal-500/30',
            // Text
            'text-white text-sm font-semibold',
            // Hover effects
            'hover:shadow-xl hover:shadow-teal-500/40',
            'hover:scale-105',
            // Active state
            'active:scale-95',
            // Transitions
            'transition-all duration-300 ease-out',
            // Entrance animation
            'animate-in fade-in-0 slide-in-from-bottom-4 duration-300',
            // Pulse animation hint
            'hover:animate-none'
          )}
        >
          {/* Animated ring effect on hover */}
          <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 group-hover:animate-ping" />
          
          <ArrowUp className="h-5 w-5 sm:h-4 sm:w-4 group-hover:-translate-y-0.5 transition-transform relative z-10" />
          <span className="hidden sm:inline sm:ml-2 relative z-10">Lên đầu</span>
          
          {/* Shimmer effect */}
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
        </button>
      )}
    </div>
  );
}
