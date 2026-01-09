'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ChevronRight } from 'lucide-react';
import { useRecentlyViewedStore, RecentlyViewedItem } from '@/stores/useRecentlyViewedStore';
import { cn } from '@/lib/utils';

/**
 * Recently Viewed Section Component
 * 
 * Features:
 * - Shows last 6 viewed properties
 * - Lazy loaded via dynamic import
 * - No API calls - uses localStorage
 * - Minimal footprint for performance
 */
export function RecentlyViewedSection() {
  const [mounted, setMounted] = useState(false);
  const items = useRecentlyViewedStore((state) => state.items);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render on server or if no items
  if (!mounted || items.length === 0) return null;

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1280px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg md:text-xl font-semibold text-slate-800">
              Đã xem gần đây
            </h2>
          </div>
          <Link 
            href="/properties"
            className="flex items-center gap-1 text-sm text-[#0891b2] hover:text-[#0c4a6e] transition-colors"
          >
            Xem tất cả
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Items Grid - Horizontal scroll on mobile */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 lg:grid-cols-6 md:overflow-visible">
          {items.map((item) => (
            <RecentlyViewedCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RecentlyViewedCard({ item }: { item: RecentlyViewedItem }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  return (
    <Link
      href={`/properties/${item.id}`}
      className={cn(
        "group flex-shrink-0 w-40 md:w-full",
        "bg-white rounded-lg border border-slate-100",
        "hover:border-cyan-200 hover:shadow-md",
        "transition-all duration-300"
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] rounded-t-lg overflow-hidden bg-slate-100">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="160px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <Clock className="w-8 h-8" />
          </div>
        )}
        
        {/* Code badge */}
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[10px] font-medium text-white">
          {item.code}
        </div>
      </div>

      {/* Info */}
      <div className="p-2">
        <h3 className="text-xs font-medium text-slate-800 line-clamp-1 group-hover:text-[#0891b2] transition-colors">
          {item.name}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] text-slate-500">{item.bedroomCount} PN</span>
          <span className="text-xs font-semibold text-[#0891b2]">
            {formatPrice(item.priceWeekday)}đ
          </span>
        </div>
      </div>
    </Link>
  );
}

export default RecentlyViewedSection;
