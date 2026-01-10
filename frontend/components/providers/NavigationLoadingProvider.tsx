'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface NavigationLoadingContextType {
  isNavigating: boolean;
  startNavigation: () => void;
  stopNavigation: () => void;
}

const NavigationLoadingContext = createContext<NavigationLoadingContextType>({
  isNavigating: false,
  startNavigation: () => {},
  stopNavigation: () => {},
});

export function useNavigationLoading() {
  return useContext(NavigationLoadingContext);
}

interface NavigationLoadingProviderProps {
  children: ReactNode;
}

export function NavigationLoadingProvider({ children }: NavigationLoadingProviderProps) {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();

  const startNavigation = useCallback(() => {
    setIsNavigating(true);
  }, []);

  const stopNavigation = useCallback(() => {
    setIsNavigating(false);
  }, []);

  // Auto-stop navigation loading when route changes
  useEffect(() => {
    // When pathname changes, navigation is complete
    setIsNavigating(false);
  }, [pathname]);

  // Safety timeout - stop loading after 10 seconds max
  useEffect(() => {
    if (isNavigating) {
      const timeout = setTimeout(() => {
        setIsNavigating(false);
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [isNavigating]);

  return (
    <NavigationLoadingContext.Provider value={{ isNavigating, startNavigation, stopNavigation }}>
      {children}
      
      {/* Global Navigation Loading Overlay */}
      {isNavigating && (
        <div 
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-white/60 backdrop-blur-sm animate-in fade-in duration-200"
          role="status"
          aria-label="Đang tải trang..."
        >
          <div className="flex flex-col items-center gap-4">
            {/* Spinning loader */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-slate-200" />
              <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-cyan-500 animate-spin" />
            </div>
            
            {/* Loading text */}
            <p className="text-slate-600 font-medium text-sm animate-pulse">
              Đang tải...
            </p>
          </div>
        </div>
      )}
    </NavigationLoadingContext.Provider>
  );
}

