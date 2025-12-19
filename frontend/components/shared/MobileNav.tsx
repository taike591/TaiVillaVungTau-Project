'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Home, Building2, MessageSquare, Phone, MapPin } from 'lucide-react';
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

  const menuItems = [
    { href: '/', icon: Home, label: t('home'), color: 'bg-gradient-to-br from-cyan-500 to-blue-500', iconClass: 'translate-x-[1px]' },
    { href: '/properties', icon: Building2, label: t('properties'), color: 'bg-gradient-to-br from-teal-500 to-emerald-500', iconClass: '' },
    { href: '/contact', icon: MessageSquare, label: t('contact'), color: 'bg-gradient-to-br from-orange-500 to-amber-500', iconClass: '' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]" suppressHydrationWarning>
      {/* Solid background - completely covers everything */}
      <div 
        className="absolute inset-0 bg-slate-900"
        style={{ backgroundColor: '#0f172a' }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900/50" />

      {/* Decorative blurs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      {/* Content container */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <Link 
            href="/" 
            onClick={handleLinkClick} 
            className="flex items-center gap-3"
          >
            <div className="ring-2 ring-white/30 rounded-full p-0.5">
              <Image 
                src="/logo.jpg" 
                alt="Taivillavungtau" 
                width={36} 
                height={36} 
                className="h-9 w-9 object-cover rounded-full"
              />
            </div>
            <span className="text-white font-bold text-base">Taivillavungtau</span>
          </Link>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Đóng menu"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Menu Items - Horizontal grid with centered icons */}
        <nav className="flex-1 flex items-center justify-center px-6">
          <div className="grid grid-cols-3 gap-4 w-full max-w-[340px]">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className="flex flex-col items-center justify-start p-4 pt-5 min-h-[120px] bg-white/5 border border-white/15 rounded-2xl hover:bg-white/10 hover:border-white/25 transition-all group"
              >
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform',
                  item.color
                )}>
                  <item.icon className="h-6 w-6 text-white" strokeWidth={1.5} />
                </div>
                <span className="text-white/90 font-medium text-sm text-center leading-tight">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="px-6 py-6 border-t border-white/10">
          <div className="flex flex-col items-center gap-3 mb-4">
            <a 
              href="tel:0868947734" 
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <Phone className="h-4 w-4 text-cyan-400" />
              <span className="text-sm">0868947734</span>
            </a>
            <div className="flex items-center gap-2 text-white/70">
              <MapPin className="h-4 w-4 text-teal-400" />
              <span className="text-sm">Vũng Tàu, Vietnam</span>
            </div>
          </div>
          <p className="text-white/40 text-xs text-center">
            © 2024 Taivillavungtau
          </p>
        </div>
      </div>
    </div>
  );
}
