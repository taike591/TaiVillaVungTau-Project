'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import MaintenancePage from '@/components/shared/MaintenancePage';

interface ServerStatusContextType {
  isServerDown: boolean;
  setServerDown: (down: boolean) => void;
  checkServer: () => Promise<boolean>;
}

const ServerStatusContext = createContext<ServerStatusContextType | undefined>(undefined);

export function useServerStatus() {
  const context = useContext(ServerStatusContext);
  if (!context) {
    throw new Error('useServerStatus must be used within ServerStatusProvider');
  }
  return context;
}

interface ServerStatusProviderProps {
  children: ReactNode;
}

export function ServerStatusProvider({ children }: ServerStatusProviderProps) {
  const [isServerDown, setIsServerDown] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const setServerDown = useCallback((down: boolean) => {
    setIsServerDown(down);
  }, []);

  const checkServer = useCallback(async (): Promise<boolean> => {
    if (isChecking) return !isServerDown;
    
    setIsChecking(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    
    try {
      const res = await fetch(`${apiUrl}/api/v1/properties?size=1`, {
        method: 'GET',
        cache: 'no-store',
      });
      
      if (res.ok) {
        setIsServerDown(false);
        setIsChecking(false);
        return true;
      } else {
        setIsServerDown(true);
        setIsChecking(false);
        return false;
      }
    } catch {
      setIsServerDown(true);
      setIsChecking(false);
      return false;
    }
  }, [isChecking, isServerDown]);

  const handleRetry = useCallback(async () => {
    const isUp = await checkServer();
    if (isUp) {
      // Reload the page to get fresh data
      window.location.reload();
    }
  }, [checkServer]);

  // Listen for fetch errors globally
  useEffect(() => {
    const handleOnline = () => {
      checkServer();
    };

    const handleOffline = () => {
      setIsServerDown(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkServer]);

  if (isServerDown) {
    return (
      <MaintenancePage 
        onRetry={handleRetry}
        message="Hệ thống đang được bảo trì để phục vụ bạn tốt hơn! Vui lòng thử lại sau ít phút."
      />
    );
  }

  return (
    <ServerStatusContext.Provider value={{ isServerDown, setServerDown, checkServer }}>
      {children}
    </ServerStatusContext.Provider>
  );
}

// Hook to report server errors from any component
export function useReportServerError() {
  const { setServerDown } = useServerStatus();
  
  return useCallback((error: Error | unknown) => {
    // Check if it's a network error or server error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      setServerDown(true);
    } else if (error instanceof Error && 
      (error.message.includes('ECONNREFUSED') || 
       error.message.includes('Failed to fetch') ||
       error.message.includes('Network Error'))) {
      setServerDown(true);
    }
  }, [setServerDown]);
}
