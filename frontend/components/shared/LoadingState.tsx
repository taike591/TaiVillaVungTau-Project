import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TropicalSpinner } from '@/components/ui/skeleton';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'default' | 'tropical';
}

export function LoadingSpinner({ size = 'md', className, variant = 'default' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  // Use tropical spinner variant - Requirements 6.4, 9.4
  if (variant === 'tropical') {
    return <TropicalSpinner className={cn(sizeClasses[size], className)} />;
  }

  // Default spinner with tropical orange color - Requirements 9.4
  return (
    <Loader2 className={cn('animate-spin', sizeClasses[size], className)} style={{ color: 'var(--tropical-orange-500)' }} />
  );
}

interface LoadingButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

export function LoadingButton({ children, isLoading, className }: LoadingButtonProps) {
  return (
    <span className={cn('flex items-center gap-2', className)}>
      {isLoading && <LoadingSpinner size="sm" />}
      {children}
    </span>
  );
}

interface PropertyCardSkeletonProps {
  count?: number;
}

export function PropertyCardSkeleton({ count = 6 }: PropertyCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg shadow-warm-md overflow-hidden"
        >
          {/* Tropical gradient shimmer effect - Requirements 9.4 */}
          <div className="h-48 bg-gradient-warm-glow animate-tropical-shimmer relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-sunset opacity-20" />
          </div>
          <div className="p-4 space-y-3">
            <div className="h-6 rounded w-3/4 animate-pulse" style={{ backgroundColor: 'var(--warm-gray-200)' }} />
            <div className="h-4 rounded w-1/2 animate-pulse" style={{ backgroundColor: 'var(--warm-gray-200)' }} />
            <div className="space-y-2">
              <div className="h-4 rounded animate-pulse" style={{ backgroundColor: 'var(--warm-gray-200)' }} />
              <div className="h-4 rounded w-5/6 animate-pulse" style={{ backgroundColor: 'var(--warm-gray-200)' }} />
            </div>
            <div className="flex justify-between pt-2">
              <div className="h-6 rounded w-1/3 animate-pulse" style={{ backgroundColor: 'var(--warm-gray-200)' }} />
              <div className="h-6 rounded w-1/4 animate-pulse" style={{ backgroundColor: 'var(--warm-gray-200)' }} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 animate-pulse">
          {Array.from({ length: columns }).map((_, j) => (
            <div
              key={j}
              className="h-12 rounded flex-1"
              style={{ backgroundColor: 'var(--warm-gray-200)' }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

interface FormSkeletonProps {
  fields?: number;
}

export function FormSkeleton({ fields = 5 }: FormSkeletonProps) {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 rounded w-1/4" style={{ backgroundColor: 'var(--warm-gray-200)' }} />
          <div className="h-10 rounded" style={{ backgroundColor: 'var(--warm-gray-200)' }} />
        </div>
      ))}
      <div className="h-10 rounded w-32 mt-6" style={{ backgroundColor: 'var(--warm-gray-200)' }} />
    </div>
  );
}

interface ProgressBarProps {
  progress: number;
  className?: string;
}

export function ProgressBar({ progress, className }: ProgressBarProps) {
  return (
    <div className={cn('w-full rounded-full h-2', className)} style={{ backgroundColor: 'var(--warm-gray-200)' }}>
      <div
        className="bg-gradient-sunset h-2 rounded-full transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
}

interface PageLoadingProps {
  message?: string;
}

export function PageLoading({ message = 'Đang tải...' }: PageLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <LoadingSpinner size="lg" variant="tropical" />
      <p style={{ color: 'var(--warm-gray-600)' }}>{message}</p>
    </div>
  );
}
