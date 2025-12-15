import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  maxVisiblePages?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  maxVisiblePages = 7,
}: PaginationProps) {
  // Don't render if there's only one page or no pages
  if (totalPages <= 1) {
    return null;
  }

  // Calculate which page numbers to show
  const getVisiblePages = (): number[] => {
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    const halfVisible = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(0, currentPage - halfVisible);
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    // Adjust start if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    const pages: number[] = [];
    
    // Always show first page
    if (startPage > 0) {
      pages.push(0);
      if (startPage > 1) {
        pages.push(-1); // Ellipsis marker
      }
    }

    // Show middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Always show last page
    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        pages.push(-1); // Ellipsis marker
      }
      pages.push(totalPages - 1);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();
  const isPreviousDisabled = currentPage === 0;
  const isNextDisabled = currentPage === totalPages - 1;

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-1', className)}
    >
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isPreviousDisabled}
        aria-label="Trang trước"
        className="gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Trước</span>
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => {
          if (page === -1) {
            // Ellipsis
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-gray-500"
                aria-hidden="true"
              >
                ...
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <Button
              key={page}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPageChange(page)}
              disabled={isActive}
              aria-label={`Trang ${page + 1}`}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'min-w-10',
                isActive && 'pointer-events-none'
              )}
            >
              {page + 1}
            </Button>
          );
        })}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isNextDisabled}
        aria-label="Trang sau"
        className="gap-1"
      >
        <span className="hidden sm:inline">Sau</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
