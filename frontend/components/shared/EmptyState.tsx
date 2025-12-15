import { Search, Home, Building2, Filter, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: 'search' | 'home' | 'building' | 'filter' | 'map';
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const iconMap = {
  search: Search,
  home: Home,
  building: Building2,
  filter: Filter,
  map: MapPin,
};

export function EmptyState({
  title = 'Không tìm thấy kết quả',
  message = 'Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác.',
  icon = 'search',
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  const Icon = iconMap[icon];

  return (
    <div className={cn('flex flex-col items-center justify-center min-h-[400px] p-8 text-center', className)}>
      {/* Tropical gradient icon background */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-sunset opacity-10 blur-2xl rounded-full" />
        <div className="relative bg-gradient-warm-glow rounded-full p-6 shadow-warm-md">
          <Icon className="h-16 w-16 text-[var(--tropical-orange-500)]" />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-[var(--warm-gray-900)] mb-3">
        {title}
      </h3>
      
      <p className="text-[var(--warm-gray-600)] max-w-md mb-6 leading-relaxed">
        {message}
      </p>

      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant="sunset"
          size="lg"
          className="gap-2"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

interface NoPropertiesProps {
  hasFilters?: boolean;
  onClearFilters?: () => void;
  onGoHome?: () => void;
  className?: string;
}

export function NoProperties({
  hasFilters = false,
  onClearFilters,
  onGoHome,
  className,
}: NoPropertiesProps) {
  if (hasFilters) {
    return (
      <EmptyState
        title="Không tìm thấy villa phù hợp"
        message="Không có villa nào khớp với tiêu chí tìm kiếm của bạn. Thử điều chỉnh bộ lọc hoặc xóa một số tiêu chí."
        icon="filter"
        actionLabel="Xóa bộ lọc"
        onAction={onClearFilters}
        className={className}
      />
    );
  }

  return (
    <EmptyState
      title="Chưa có villa nào"
      message="Hiện tại chưa có villa nào trong hệ thống. Vui lòng quay lại sau."
      icon="building"
      actionLabel="Về trang chủ"
      onAction={onGoHome}
      className={className}
    />
  );
}

interface NoSearchResultsProps {
  searchQuery: string;
  onClearSearch?: () => void;
  className?: string;
}

export function NoSearchResults({
  searchQuery,
  onClearSearch,
  className,
}: NoSearchResultsProps) {
  return (
    <EmptyState
      title={`Không tìm thấy "${searchQuery}"`}
      message="Không có kết quả nào khớp với từ khóa tìm kiếm của bạn. Thử tìm kiếm với từ khóa khác."
      icon="search"
      actionLabel="Xóa tìm kiếm"
      onAction={onClearSearch}
      className={className}
    />
  );
}

interface NoLocationResultsProps {
  location: string;
  onClearLocation?: () => void;
  className?: string;
}

export function NoLocationResults({
  location,
  onClearLocation,
  className,
}: NoLocationResultsProps) {
  return (
    <EmptyState
      title={`Không có villa tại ${location}`}
      message="Không tìm thấy villa nào ở khu vực này. Thử tìm kiếm ở khu vực khác."
      icon="map"
      actionLabel="Xóa vị trí"
      onAction={onClearLocation}
      className={className}
    />
  );
}
