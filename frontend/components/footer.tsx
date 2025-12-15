'use client';

import Link from 'next/link';
import { Facebook, MapPin, Clock, MessageCircle, Phone, Mail, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  return (
    <footer 
      id="footer"
      className="relative text-white overflow-hidden bg-gray-900" 
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Background Image - villa-collage.jpg */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: "url('/villa-collage.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/70 to-gray-900/60" />
      </div>

      {/* Decorative Ocean Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-400 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-400 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        
        {/* --- SECTION 1: MAIN CTA --- */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-16 pb-16 border-b border-white/20">
          <div className="text-center lg:text-left max-w-2xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-white tracking-tight drop-shadow-lg">
              {t('readyForVacation')}
            </h2>
            <p className="text-lg md:text-xl text-white/90 font-medium">
              {t('contactNow')}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
             <Button
                asChild
                className="bg-white text-[#0c4a6e] hover:bg-cyan-50 hover:scale-105 transition-all shadow-2xl font-bold h-14 px-8 rounded-full text-base"
                size="lg"
              >
                <a 
                  href="https://zalo.me/84868947734" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                  suppressHydrationWarning
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{t('chatZalo')}</span>
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-[#0c4a6e] transition-all font-bold h-14 px-8 rounded-full text-base"
                size="lg"
              >
                <a 
                  href="tel:0868947734" 
                  suppressHydrationWarning
                  className="flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  <span>0868-947-734</span>
                </a>
              </Button>
          </div>
        </div>

        {/* --- SECTION 2: MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          
          {/* Brand & About - Takes 4 columns */}
          <div className="lg:col-span-4 space-y-6">
            <div className="mb-6">
              <img 
                src="/logo.jpg" 
                alt="Taivillavungtau Logo" 
                className="h-16 w-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
              />
            </div>
            
            <p className="text-white leading-relaxed text-sm drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] font-medium">
              Với quan điểm vừa là Host vừa là Sale, nên Page rất hiểu tâm lý của khách hàng! 
              Luôn trên tinh thần mang đến cho khách hàng những căn Villa luôn có chất lượng tốt nhất trong tầm giá. 
              Đã được suy xét chọn lọc chất lượng tại Vũng Tàu.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              <a 
                href="https://www.facebook.com/profile.php?id=100091682560247" 
                target="_blank" 
                rel="noopener noreferrer"
                suppressHydrationWarning 
                className="group p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white transition-all duration-300 border border-white/30 shadow-lg"
              >
                <Facebook className="w-5 h-5 text-white group-hover:text-[#1877F2] transition-colors drop-shadow-lg" />
              </a>
              <a 
                href="https://zalo.me/84868947734" 
                target="_blank" 
                rel="noopener noreferrer"
                suppressHydrationWarning 
                className="group p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white transition-all duration-300 border border-white/30 shadow-lg"
              >
                <MessageCircle className="w-5 h-5 text-white group-hover:text-[#0891b2] transition-colors drop-shadow-lg" />
              </a>
            </div>
          </div>

          {/* Contact Info - Takes 4 columns */}
          <div className="lg:col-span-4 space-y-6">
            <h4 className="text-xl font-bold mb-6 text-white flex items-center gap-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
              <Phone className="w-5 h-5 text-cyan-300 drop-shadow-lg" />
              {t('contactInfo')}
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-lg">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-cyan-300 drop-shadow-lg" />
                <div>
                  <p className="font-semibold text-white mb-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">{t('address')}</p>
                  <p className="text-sm text-white font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">43A La Văn Cầu, TP. Vũng Tàu</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-lg">
                <Phone className="w-5 h-5 shrink-0 mt-0.5 text-cyan-300 drop-shadow-lg" />
                <div>
                  <p className="font-semibold text-white mb-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">{t('hotline')}</p>
                  <a href="tel:0868947734" className="text-sm text-white font-medium hover:text-cyan-200 transition-colors drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]" suppressHydrationWarning>
                    0868-947-734 (Thanh Tài)
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-lg">
                <Clock className="w-5 h-5 shrink-0 mt-0.5 text-cyan-300 drop-shadow-lg" />
                <div>
                  <p className="font-semibold text-white mb-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">{t('workingHours')}</p>
                  <p className="text-sm text-white font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">{t('workingHoursValue')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links - Takes 4 columns */}
          <div className="lg:col-span-4 space-y-6">
            <h4 className="text-xl font-bold mb-6 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">{t('quickMenu')}</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  suppressHydrationWarning 
                  className="group flex items-center gap-2 text-white hover:text-cyan-200 transition-colors p-2 rounded-lg hover:bg-white/20 font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 group-hover:scale-150 transition-transform shadow-lg"></span>
                  <span>{tNav('home')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/properties" 
                  suppressHydrationWarning 
                  className="group flex items-center gap-2 text-white hover:text-cyan-200 transition-colors p-2 rounded-lg hover:bg-white/20 font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 group-hover:scale-150 transition-transform shadow-lg"></span>
                  <span>{tNav('properties')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  suppressHydrationWarning 
                  className="group flex items-center gap-2 text-white hover:text-cyan-200 transition-colors p-2 rounded-lg hover:bg-white/20 font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 group-hover:scale-150 transition-transform shadow-lg"></span>
                  <span>{tNav('contact')}</span>
                </Link>
              </li>
            </ul>

            {/* Facebook Page Plugin Placeholder */}
            <div className="mt-8 p-4 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-lg">
              <p className="text-sm text-white mb-3 font-semibold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">{t('followFanpage')}</p>
              <a 
                href="https://www.facebook.com/profile.php?id=100091682560247" 
                target="_blank" 
                rel="noopener noreferrer"
                suppressHydrationWarning
                className="flex items-center gap-2 text-white hover:text-cyan-200 transition-colors drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
              >
                <Facebook className="w-5 h-5 drop-shadow-lg" />
                <span className="text-sm font-medium">Taivillavungtau</span>
              </a>
            </div>
          </div>
        </div>

        {/* --- SECTION 3: BOTTOM BAR --- */}
        <div className="pt-8 border-t border-white/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            <p className="flex items-center gap-2">
              {t('copyright', { year: new Date().getFullYear() })} 
              <span className="hidden sm:inline">{t('tagline')}</span>
            </p>
            <p className="flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-400 fill-red-400 drop-shadow-lg" /> in Vũng Tàu
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
