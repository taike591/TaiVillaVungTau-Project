'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition, ComponentProps, forwardRef, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type LinkProps = ComponentProps<typeof Link>;

interface LinkWithLoadingProps extends Omit<LinkProps, 'children'> {
  /** Show loading spinner inside the link */
  showSpinner?: boolean;
  /** Additional classes for loading state */
  loadingClassName?: string;
  /** Children can be a ReactNode or a function that receives loading state */
  children: ReactNode | ((isLoading: boolean) => ReactNode);
}

/**
 * Enhanced Link component with loading state feedback
 * Shows visual indication when navigation is in progress
 */
export const LinkWithLoading = forwardRef<HTMLAnchorElement, LinkWithLoadingProps>(
  function LinkWithLoading(
    { 
      href, 
      onClick, 
      showSpinner = false,
      loadingClassName,
      className, 
      children, 
      ...props 
    },
    ref
  ) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isNavigating, setIsNavigating] = useState(false);

    const isLoading = isPending || isNavigating;

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Call original onClick if provided
      onClick?.(e);

      // Don't handle if default prevented or modifier keys
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;

      // External links - don't handle
      const hrefString = typeof href === 'string' ? href : href.pathname || '';
      if (hrefString.startsWith('http') || hrefString.startsWith('//')) return;

      // Show loading state
      setIsNavigating(true);

      // Use transition for smoother loading state
      startTransition(() => {
        // Navigation happens, loading will clear when route changes
      });
    };

    const renderChildren = (): ReactNode => {
      if (typeof children === 'function') {
        return children(isLoading);
      }
      return children;
    };

    return (
      <Link
        ref={ref}
        href={href}
        onClick={handleClick}
        className={cn(
          className,
          isLoading && loadingClassName,
          isLoading && 'pointer-events-none'
        )}
        {...props}
      >
        {showSpinner && isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            {renderChildren()}
          </span>
        ) : (
          renderChildren()
        )}
      </Link>
    );
  }
);

