'use client';

import { Bookmark } from 'lucide-react';
import { useWishlistStore } from '@/stores/useWishlistStore';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface WishlistButtonProps {
  property: {
    id: number;
    code: string;
    name: string;
    image: string;
    priceWeekday: number;
    bedroomCount: number;
  };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function WishlistButton({ property, size = 'md', className }: WishlistButtonProps) {
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Fix hydration mismatch - only check wishlist state after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Always render as "not saved" on server, then update on client
  const isSaved = isMounted && isInWishlist(property.id);
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    
    if (isInWishlist(property.id)) {
      removeItem(property.id);
      toast.success('Đã xóa khỏi danh sách yêu thích', {
        description: property.name,
        duration: 2000,
      });
    } else {
      addItem({
        id: property.id,
        code: property.code,
        name: property.name,
        image: property.image,
        priceWeekday: property.priceWeekday,
        bedroomCount: property.bedroomCount,
      });
      toast.success('Đã thêm vào danh sách yêu thích', {
        description: property.name,
        duration: 2000,
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex items-center justify-center rounded-full transition-all duration-300',
        'bg-white/90 hover:bg-white shadow-lg hover:shadow-xl',
        'backdrop-blur-sm border border-white/50',
        sizeClasses[size],
        isAnimating && 'scale-125',
        className
      )}
      aria-label={isSaved ? 'Bỏ lưu' : 'Lưu lại'}
      title={isSaved ? 'Bỏ lưu' : 'Lưu lại'}
      suppressHydrationWarning
    >
      <Bookmark
        className={cn(
          iconSizes[size],
          'transition-all duration-300',
          isSaved 
            ? 'text-amber-500 fill-amber-500 drop-shadow-sm' 
            : 'text-gray-600 hover:text-amber-400'
        )}
      />
    </button>
  );
}


