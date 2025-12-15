'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, fetchUser, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // 1. Check if we have a token
      if (token) {
        // 2. If we have token but no user, try to fetch user
        if (!user) {
          try {
            await fetchUser();
          } catch (error) {
            console.error('Failed to fetch user in provider:', error);
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [token, user, fetchUser]);

  // Protected route check
  useEffect(() => {
    if (isLoading) return;

    const isAdminRoute = pathname?.startsWith('/admin');
    
    if (isAdminRoute && !isAuthenticated()) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  return (
    <AuthContext.Provider value={{ isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
