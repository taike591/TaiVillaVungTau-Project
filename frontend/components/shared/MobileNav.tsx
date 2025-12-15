'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  transparent?: boolean;
}

export function MobileNav({ isOpen, onClose, transparent = false }: MobileNavProps) {
  const t = useTranslations('nav');

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <>
      {/* Overlay backdrop with tropical tint - Requirement 7.4 */}
      <div
        className={cn(
          'fixed inset-0 z-40 transition-opacity duration-300',
          'bg-linear-to-br from-ocean-blue-900/40 via-black/50 to-teal-water-900/40',
          'backdrop-blur-sm',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
        suppressHydrationWarning
      />

      {/* Slide-out menu with tropical styling - Requirements 7.4, 11.5 */}
      <div
        suppressHydrationWarning
        className={cn(
          'fixed top-0 right-0 h-full w-[280px] z-50',
          'bg-linear-to-b from-white to-ocean-blue-50/30',
          'shadow-warm-2xl',
          'transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
          !isOpen && 'invisible'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Close button with tropical colors and touch-friendly size - Requirement 11.5 */}
        <div 
          className="flex items-center justify-between p-4 border-b border-ocean-blue-100"
          suppressHydrationWarning
        >
          <div className="text-xl font-bold" suppressHydrationWarning>
            <Image 
              src="/logo.jpg" 
              alt="Taivillavungtau" 
              width={50} 
              height={50} 
              className="h-10 w-10 object-cover rounded-full"
            />
          </div>
          <button
            onClick={onClose}
            className="p-3 min-w-[44px] min-h-[44px] rounded-lg hover:bg-ocean-blue-100 active:bg-ocean-blue-200 active:scale-95 transition-all duration-200"
            aria-label="Close menu"
          >
            <X className="h-6 w-6 text-ocean-blue-600" />
          </button>
        </div>

        {/* Menu items with tropical hover effects and touch-friendly animations - Requirements 7.4, 11.5 */}
        <nav className="flex flex-col p-4 space-y-2">
          <Link
            href="/"
            suppressHydrationWarning
            onClick={handleLinkClick}
            className="px-4 py-4 min-h-[52px] text-navy-slate-700 hover:bg-ocean-blue-50 hover:text-ocean-blue-600 active:bg-ocean-blue-100 active:scale-98 rounded-lg font-semibold transition-all duration-200 hover:shadow-warm-sm flex items-center"
          >
            <span>{t('home')}</span>
          </Link>
          <Link
            href="/properties"
            suppressHydrationWarning
            onClick={handleLinkClick}
            className="px-4 py-4 min-h-[52px] text-warm-gray-700 hover:bg-tropical-orange-50 hover:text-tropical-orange-600 active:bg-tropical-orange-100 active:scale-98 rounded-lg font-semibold transition-all duration-200 hover:shadow-warm-sm flex items-center"
          >
            <span>{t('properties')}</span>
          </Link>
          <Link
            href="/contact"
            suppressHydrationWarning
            onClick={handleLinkClick}
            className="px-4 py-4 min-h-[52px] text-warm-gray-700 hover:bg-tropical-orange-50 hover:text-tropical-orange-600 active:bg-tropical-orange-100 active:scale-98 rounded-lg font-semibold transition-all duration-200 hover:shadow-warm-sm flex items-center"
          >
            <span>{t('contact')}</span>
          </Link>
        </nav>
      </div>
    </>
  );
}
