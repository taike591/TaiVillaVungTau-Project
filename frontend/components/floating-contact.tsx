'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, Phone, X, Facebook, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  // Don't show on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {/* Floating Button - more responsive positioning */}
      <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-2 sm:gap-3">
        <div
          className={cn(
            "flex flex-col gap-3 transition-all duration-300 origin-bottom-right",
            isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
          )}
        >
          {/* Zalo */}
          <a
            href="https://zalo.me/84868947734"
            target="_blank"
            rel="noopener noreferrer"
            suppressHydrationWarning
            aria-label="Chat qua Zalo"
            className="group flex items-center gap-3 bg-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 pr-5 pl-4 py-3 border-2 border-[#0891b2]"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0891b2] to-[#0ea5e9] flex items-center justify-center shadow-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-500 font-medium">Chat ngay qua</p>
              <p className="text-sm font-bold text-[#0891b2]">Zalo</p>
            </div>
          </a>

          {/* Phone */}
          <a
            href="tel:0868947734"
            aria-label="Gọi điện thoại 0868-947-734"
            className="group flex items-center gap-3 bg-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 pr-5 pl-4 py-3 border-2 border-green-500"
            suppressHydrationWarning
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-500 font-medium">Gọi điện</p>
              <p className="text-sm font-bold text-green-600">0868-947-734</p>
            </div>
          </a>

          {/* Facebook */}
          <a
            href="https://www.facebook.com/profile.php?id=100091682560247"
            target="_blank"
            rel="noopener noreferrer"
            suppressHydrationWarning
            aria-label="Nhắn tin qua Facebook"
            className="group flex items-center gap-3 bg-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 pr-5 pl-4 py-3 border-2 border-[#1877F2]"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1877F2] to-[#0e5fd8] flex items-center justify-center shadow-lg">
              <Facebook className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-500 font-medium">Nhắn tin qua</p>
              <p className="text-sm font-bold text-[#1877F2]">Facebook</p>
            </div>
          </a>
        </div>

        {/* Main Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center",
            isOpen 
              ? "bg-gradient-to-br from-red-500 to-red-600 rotate-90" 
              : "bg-gradient-to-br from-[#0891b2] to-[#0ea5e9]"
          )}
          aria-label={isOpen ? "Đóng menu liên hệ" : "Mở menu liên hệ"}
        >
          {/* Pulse animation when closed */}
          {!isOpen && (
            <>
              <span className="absolute inset-0 rounded-full bg-[#0891b2] animate-ping opacity-75"></span>
              <span className="absolute inset-0 rounded-full bg-[#0891b2] animate-pulse opacity-50"></span>
            </>
          )}
          
          {/* Icon */}
          <div className="relative z-10">
            {isOpen ? (
              <X className="w-7 h-7 text-white" />
            ) : (
              <MessageCircle className="w-7 h-7 text-white" />
            )}
          </div>
        </button>

        {/* Tooltip when closed */}
        {!isOpen && (
          <div className="absolute right-20 bottom-4 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            Cần hỗ trợ?
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-gray-900"></div>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop when open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
