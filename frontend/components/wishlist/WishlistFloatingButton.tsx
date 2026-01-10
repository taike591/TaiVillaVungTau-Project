'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Bookmark, X, Trash2, Copy, Check, Facebook, MessageCircle } from 'lucide-react';
import { useWishlistStore } from '@/stores/useWishlistStore';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export function WishlistFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const pathname = usePathname();
  
  const { items, removeItem, clearAll, getFormattedMessage, getMessengerUrl, getZaloUrl } = useWishlistStore();
  const t = useTranslations('wishlist');
  const tCommon = useTranslations('common');

  // Lock body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      // Prevent scrolling on html, body
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`; // Prevent layout shift
      document.body.style.touchAction = 'none'; // Prevent touch scroll
    } else {
      // Restore scroll
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.body.style.touchAction = '';
    }

    return () => {
      // Cleanup on unmount
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);
  
  // Don't show on admin pages
  if (pathname?.startsWith('/taike-manage')) {
    return null;
  }


  const handleCopy = async () => {
    const message = getFormattedMessage();
    if (!message) return;
    
    try {
      await navigator.clipboard.writeText(message);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleMessenger = () => {
    const url = getMessengerUrl();
    window.open(url, '_blank');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  return (
    <>
      {/* Floating Button - Left side */}
      <button
        onClick={() => setIsOpen(true)}
        onTouchEnd={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
        className={cn(
          'fixed bottom-4 sm:bottom-6 left-6 z-[60] flex items-center gap-2 px-4 py-3 rounded-full',
          'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-2xl',
          'hover:shadow-3xl hover:scale-105 transition-all duration-300',
          // Touch optimization for Android
          'touch-manipulation select-none',
          items.length === 0 && 'opacity-0 pointer-events-none scale-0'
        )}
        aria-label="Mở danh sách đã lưu"
      >
        <Bookmark className="w-5 h-5 fill-current" />
        <span className="font-bold">{items.length}</span>
        
        {/* Pulse animation */}
        <span className="absolute inset-0 rounded-full bg-amber-500 animate-ping opacity-25 pointer-events-none" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Panel */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[100] flex flex-col',
          'transform transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-white fill-current" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Đã lưu</h2>
              <p className="text-sm text-gray-600">{items.length} căn đã lưu</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>


        {/* Content - with proper flex sizing */}
        <div 
          className="flex-1 overflow-y-auto overscroll-contain min-h-0"
          style={{ touchAction: 'pan-y' }}
        >
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Bookmark className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 mb-2">Chưa có căn nào được lưu</p>
              <p className="text-sm text-gray-400">
                Nhấn vào icon 🔖 trên các căn villa để thêm vào danh sách
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 hover:bg-gray-50 transition-colors">
                  {/* Image */}
                  <Link 
                    href={`/properties/${item.id}`}
                    onClick={() => setIsOpen(false)}
                    className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100"
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100">
                        <Bookmark className="w-8 h-8 text-amber-400" />
                      </div>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link 
                      href={`/properties/${item.id}`}
                      onClick={() => setIsOpen(false)}
                      className="block"
                    >
                      <span className="inline-block px-2 py-0.5 bg-cyan-100 text-cyan-700 text-xs font-bold rounded mb-1">
                        {item.code}
                      </span>
                      <h3 className="font-medium text-gray-900 truncate hover:text-cyan-600 transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600">
                      {item.bedroomCount} {tCommon('beds')} • <span className="text-cyan-600 font-semibold">{formatPrice(item.priceWeekday)}đ</span>/{tCommon('perNight')}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 hover:bg-red-100 rounded-full transition-colors self-center"
                    aria-label={t('remove')}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions - compact layout */}
        {items.length > 0 && (
          <div className="flex-shrink-0 p-3 bg-white border-t space-y-2">
            {/* Copy Button - smaller */}
            <button
              onClick={handleCopy}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all',
                copySuccess
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {copySuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  {t('copied')}
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  {t('copyList')}
                </>
              )}
            </button>

            {/* Messenger & Zalo Buttons - side by side */}
            <div className="flex gap-2">
              <button
                onClick={handleMessenger}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium bg-gradient-to-r from-[#0084FF] to-[#0066CC] text-white hover:shadow-md transition-all"
              >
                <Facebook className="w-4 h-4" />
                Gửi qua Messenger
              </button>
              <button
                onClick={() => window.open(getZaloUrl(), '_blank')}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium bg-gradient-to-r from-[#0891b2] to-[#0ea5e9] text-white hover:shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Gửi qua Zalo
              </button>
            </div>

            {/* Clear All - smaller */}
            <button
              onClick={clearAll}
              className="w-full text-xs text-gray-400 hover:text-red-500 transition-colors py-1"
            >
              {t('clearAll')}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
