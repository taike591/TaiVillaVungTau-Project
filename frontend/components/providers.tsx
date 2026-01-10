'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState, Suspense } from 'react';
import { ServerStatusProvider } from '@/components/providers/ServerStatusProvider';
import { NavigationLoadingProvider } from '@/components/providers/NavigationLoadingProvider';
import { ScrollToTop, PageLoadingIndicator } from '@/components/shared';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ServerStatusProvider>
        <NavigationLoadingProvider>
          {/* Global Page Loading Indicator - Progress Bar */}
          <Suspense fallback={null}>
            <PageLoadingIndicator />
          </Suspense>
          
          {children}
          
          {/* Global Scroll to Top Button - visible on all pages */}
          <ScrollToTop />
        </NavigationLoadingProvider>
      </ServerStatusProvider>
    </QueryClientProvider>
  );
}

