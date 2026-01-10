'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { ServerStatusProvider } from '@/components/providers/ServerStatusProvider';
import { ScrollToTop } from '@/components/shared';

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
        {children}
        {/* Global Scroll to Top Button - visible on all pages */}
        <ScrollToTop />
      </ServerStatusProvider>
    </QueryClientProvider>
  );
}
