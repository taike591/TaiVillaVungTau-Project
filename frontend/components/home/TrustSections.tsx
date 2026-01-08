'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';

// Stats data with numeric values for animation
const STATS = [
  { 
    numericValue: 5,
    suffix: '+',
    label: 'Năm kinh nghiệm',
    gradient: 'from-cyan-500 to-blue-600',
    iconBg: 'bg-gradient-to-br from-cyan-400/20 to-blue-500/20',
  },
  { 
    numericValue: 200,
    suffix: '+',
    label: 'Villa & Homestay',
    gradient: 'from-teal-500 to-emerald-600',
    iconBg: 'bg-gradient-to-br from-teal-400/20 to-emerald-500/20',
  },
  { 
    numericValue: 2000,
    suffix: '+',
    label: 'Khách hàng tin tưởng',
    gradient: 'from-amber-500 to-orange-600',
    iconBg: 'bg-gradient-to-br from-amber-400/20 to-orange-500/20',
  },
];

// Hook for counting animation
function useCountUp(target: number, duration: number = 2000, startCounting: boolean = false) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!startCounting) {
      setCount(0);
      return;
    }
    
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing function for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(easeOut * target);
      
      setCount(currentValue);
      
      if (progress >= 1) {
        setCount(target);
        clearInterval(timer);
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [target, duration, startCounting]);
  
  return count;
}

// Calculate duration based on value - smaller values finish faster
function getDuration(value: number): number {
  if (value <= 10) return 800;      // 5+ finishes in 0.8s
  if (value <= 500) return 1500;    // 200+ finishes in 1.5s
  return 2500;                       // 2000+ finishes in 2.5s
}

// Individual stat card component with its own counter
function StatCard({ stat, isVisible }: { stat: typeof STATS[0], isVisible: boolean }) {
  const duration = getDuration(stat.numericValue);
  const count = useCountUp(stat.numericValue, duration, isVisible);
  
  return (
    <div
      className="group relative p-8 rounded-3xl transition-all duration-500 hover:-translate-y-2 cursor-default"
      style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(8, 145, 178, 0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
      }}
    >
      {/* Hover glow effect */}
      <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${stat.iconBg}`} />
      
      <div className="relative text-center">
        <div className={`text-6xl md:text-7xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-3 tabular-nums`}>
          {count.toLocaleString()}{stat.suffix}
        </div>
        <div className="text-slate-600 font-semibold text-lg">
          {stat.label}
        </div>
      </div>

      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full bg-gradient-to-r ${stat.gradient} opacity-50 group-hover:opacity-100 group-hover:w-32 transition-all duration-500`} />
    </div>
  );
}

export default function TrustSections() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  // Intersection Observer to detect when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only animate once
        }
      },
      { threshold: 0.3 } // Trigger when 30% visible
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-16 md:py-20 overflow-hidden bg-[#e0f2fe]">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        {/* Stats Cards with count-up animation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {STATS.map((stat, index) => (
            <StatCard key={index} stat={stat} isVisible={isVisible} />
          ))}
        </div>

        {/* Host Story Card - Premium design */}
        <div 
          className="relative rounded-[2.5rem] overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,253,250,0.9) 100%)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 25px 50px -12px rgba(8, 145, 178, 0.15), 0 0 0 1px rgba(255,255,255,0.8)',
          }}
        >
          {/* Decorative corner accents */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-cyan-100/50 to-transparent rounded-bl-full" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-teal-100/50 to-transparent rounded-tr-full" />

          <div className="relative p-8 md:p-12 lg:p-16">
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              {/* Logo Section - Enhanced */}
              <div className="relative flex-shrink-0">
                {/* Outer glow ring */}
                <div className="absolute inset-0 -m-6 rounded-full bg-gradient-to-br from-cyan-400/20 via-teal-400/20 to-blue-400/20 blur-xl animate-pulse" />
                
                {/* Rotating border effect */}
                <div className="absolute inset-0 -m-1 rounded-full bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-400 opacity-30 animate-spin" style={{ animationDuration: '8s' }} />
                
                {/* Main logo */}
                <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-white shadow-2xl shadow-cyan-200/50">
                  <Image
                    src="/logo.jpg"
                    alt="Tài Villa Vũng Tàu"
                    fill
                    className="object-cover"
                    sizes="176px"
                  />
                </div>

                {/* Status badge */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-2 bg-white rounded-full shadow-lg border border-slate-100 flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                  </span>
                  <span className="text-sm font-semibold text-slate-700">Online</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 text-center lg:text-left">
                {/* Brand badge */}
                <div className="inline-flex items-center gap-2.5 px-5 py-2.5 mb-6 rounded-2xl bg-gradient-to-r from-cyan-50 to-teal-50 border border-cyan-100/50 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm">🌊</span>
                  </div>
                  <span className="text-cyan-800 font-bold">Taivillavungtau.vn</span>
                </div>

                {/* Quote - Premium typography */}
                <blockquote className="mb-8">
                  <p className="text-xl md:text-2xl lg:text-[1.65rem] text-slate-700 leading-relaxed">
                    <span className="text-cyan-400 text-5xl font-serif leading-none mr-1">"</span>
                    Với quan điểm vừa là{' '}
                    <span className="relative inline-block">
                      <span className="relative z-10 font-bold text-cyan-600">Host</span>
                      <span className="absolute bottom-0 left-0 w-full h-2 bg-cyan-200/50 -z-10" />
                    </span>{' '}
                    vừa là{' '}
                    <span className="relative inline-block">
                      <span className="relative z-10 font-bold text-cyan-600">Sale</span>
                      <span className="absolute bottom-0 left-0 w-full h-2 bg-cyan-200/50 -z-10" />
                    </span>
                    , nên Taivillavungtau.vn rất hiểu tâm lý của khách hàng! Luôn trên tinh thần mang đến những căn Villa & Homestay{' '}
                    <span className="font-bold text-teal-600 bg-gradient-to-r from-teal-50 to-cyan-50 px-2 py-0.5 rounded-lg">
                      chất lượng tốt nhất trong tầm giá
                    </span>
                    . Đã được suy xét chọn lọc chất lượng tại Vũng Tàu.
                  </p>
                </blockquote>

                {/* Author info + Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="text-center sm:text-left">
                      <p className="font-bold text-slate-900 text-lg">Thanh Tài</p>
                      <p className="text-slate-500 text-sm">Founder & Host</p>
                    </div>
                    <div className="hidden sm:block w-px h-10 bg-slate-200" />
                  </div>

                  {/* Social links - Enhanced */}
                  <div className="flex items-center gap-3">
                    <Link
                      href="https://www.facebook.com/profile.php?id=100091682560247"
                      target="_blank"
                      className="group w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-600 hover:from-blue-500 hover:to-blue-600 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                      </svg>
                    </Link>
                    <Link
                      href="https://zalo.me/0868947734"
                      target="_blank"
                      className="group w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center text-blue-600 hover:from-blue-500 hover:to-cyan-500 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/25"
                    >
                      <span className="font-bold text-sm">Z</span>
                    </Link>
                    <a
                      href="tel:0868947734"
                      className="group w-11 h-11 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-100 flex items-center justify-center text-teal-600 hover:from-teal-500 hover:to-emerald-500 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-teal-500/25"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </a>
                  </div>

                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
