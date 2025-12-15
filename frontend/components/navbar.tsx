'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Home, Building2, MessageSquare } from 'lucide-react';
import { MobileNav } from './shared/MobileNav';
import { ZaloCTAButton } from './zalo-cta-button';
import { LanguageSwitcher } from './LanguageSwitcher';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface NavbarProps {
  transparent?: boolean;
}

export function Navbar({ transparent = false }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const t = useTranslations('nav');

  // Track client-side mounting
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Track scroll position
  useEffect(() => {
    if (!isClient) return;
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isClient]);

  // Determine if navbar should be in "dark mode" (over hero) or "light mode" (scrolled)
  // Only apply transparent styling after client-side hydration to prevent mismatch
  const isDarkMode = isClient && transparent && !isScrolled;

  return (
    <>
      <nav 
        id="navigation"
        role="navigation"
        aria-label="Main navigation"
        suppressHydrationWarning
        className={`
          z-50 transition-all duration-500 ease-out
          ${transparent ? 'fixed top-0 left-0 right-0' : 'sticky top-0'}
          ${isDarkMode
            ? 'bg-gradient-to-b from-black/40 to-transparent backdrop-blur-[2px]' 
            : 'bg-white/95 backdrop-blur-xl shadow-lg shadow-blue-900/5 border-b border-slate-200/50'
          }
        `}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            
            {/* Logo with Brand Name */}
            <Link href="/" className="flex items-center gap-2 group" suppressHydrationWarning>
              <div className={`
                relative transition-all duration-300 
                ${isDarkMode ? 'ring-2 ring-white/30' : 'ring-2 ring-blue-100'}
                rounded-full p-0.5 group-hover:ring-orange-400 group-hover:scale-105 group-hover:rotate-12
              `}>
                <Image 
                  src="/logo.jpg" 
                  alt="Taivillavungtau Logo" 
                  width={40} 
                  height={40} 
                  className="h-8 w-8 md:h-9 md:w-9 object-cover rounded-full"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <span className={`
                  font-bold text-base tracking-tight transition-colors group-hover:text-orange-500
                  ${isDarkMode ? 'text-white' : 'text-slate-800'}
                `}>
                  Taivillavungtau
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - Compact & Colorful Pill Style */}
            <div className="hidden md:flex items-center">
              {/* Navigation Pills Container - Gradient Border Effect */}
              <div className={`
                flex items-center gap-1 p-1 rounded-full mr-3 relative overflow-hidden group/nav
                ${isDarkMode 
                  ? 'bg-white/10 backdrop-blur-md border border-white/20' 
                  : 'bg-white shadow-sm border border-slate-100'
                }
              `}>
                {/* Floating Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 via-blue-500/20 to-purple-500/20 blur-xl opacity-0 group-hover/nav:opacity-100 transition-opacity duration-500" />
                
                <Link 
                  href="/" 
                  suppressHydrationWarning
                  className={`
                    relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide
                    transition-all duration-300 ease-out
                    ${isDarkMode
                      ? 'text-white/90 hover:bg-white/20 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]' 
                      : 'text-slate-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-teal-400 hover:text-white hover:shadow-md'
                    }
                  `}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>{t('home')}</span>
                </Link>
                <Link 
                  href="/properties" 
                  suppressHydrationWarning
                  className={`
                    relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide
                    transition-all duration-300 ease-out
                    ${isDarkMode
                      ? 'text-white/90 hover:bg-white/20 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]' 
                      : 'text-slate-600 hover:bg-gradient-to-r hover:from-teal-400 hover:to-green-400 hover:text-white hover:shadow-md'
                    }
                  `}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{t('properties')}</span>
                </Link>
                <Link 
                  href="/contact" 
                  suppressHydrationWarning
                  className={`
                    relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide
                    transition-all duration-300 ease-out
                    ${isDarkMode
                      ? 'text-white/90 hover:bg-white/20 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]' 
                      : 'text-slate-600 hover:bg-gradient-to-r hover:from-orange-400 hover:to-red-400 hover:text-white hover:shadow-md'
                    }
                  `}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{t('contact')}</span>
                </Link>
              </div>
              
              {/* Zalo CTA Button - Slightly smaller */}
              <div className="scale-90 origin-left">
                <ZaloCTAButton variant="compact" size="sm" />
              </div>
              
              {/* Language Switcher */}
              <LanguageSwitcher 
                variant={isDarkMode ? 'transparent' : 'default'} 
                className="ml-2"
              />
            </div>

            {/* Mobile Menu Button - Compact */}
            <button 
              className={`
                md:hidden p-2 rounded-full transition-all duration-300 shadow-sm
                ${isDarkMode 
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' 
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-100'
                }
              `}
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <MobileNav 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        transparent={isDarkMode}
      />
    </>
  );
}
