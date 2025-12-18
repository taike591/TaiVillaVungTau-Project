'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Home, CheckCircle, Music, Bike, Waves, Sparkles } from 'lucide-react';
import { Card } from './ui/card';

interface BrandIntroSlideProps {
  autoAdvanceDelay?: number; // default 5000ms
  onComplete?: () => void;
}

export function BrandIntroSlide({ 
  autoAdvanceDelay = 5000,
  onComplete 
}: BrandIntroSlideProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Start fade out animation before completing
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, autoAdvanceDelay - 700); // Start fade 700ms before completion

    // Complete and unmount after fade out
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        onComplete();
      }
    }, autoAdvanceDelay);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [autoAdvanceDelay, onComplete]);

  if (!isVisible) return null;

  return (
    <div 
      suppressHydrationWarning
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-700 ease-in-out ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ isolation: 'isolate' }}
    >
      {/* Background with Ken Burns Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/villa-collage.jpg"
          alt="Villa collage background"
          fill
          sizes="100vw"
          quality={85}
          priority
          className="object-cover animate-ken-burns scale-110"
        />
        {/* Lighter Ocean-inspired Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-cyan-900/20 to-sky-900/30" suppressHydrationWarning />
        {/* Radial highlight in center for brightness */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_40%,rgba(0,0,0,0.3)_100%)] pointer-events-none" />
        {/* Ocean shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-teal-500/5 animate-shimmer pointer-events-none" />
      </div>

      {/* Floating Ocean Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${4 + (i % 5) * 2}px`,
              height: `${4 + (i % 5) * 2}px`,
              background: i % 3 === 0 
                ? 'rgba(34, 211, 238, 0.4)' 
                : i % 3 === 1 
                  ? 'rgba(20, 184, 166, 0.3)' 
                  : 'rgba(255, 255, 255, 0.3)',
              left: `${5 + i * 6.5}%`,
              animation: `floatBubble ${12 + i * 1.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
            suppressHydrationWarning
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center relative z-10">
        {/* Logo Section with Ocean Glow */}
        <div className="mb-8 animate-fade-in-scale">
          <div className="w-36 h-36 md:w-44 md:h-44 mx-auto mb-5 relative rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(34,211,238,0.3),0_20px_60px_rgba(0,0,0,0.4)] border-2 border-cyan-400/30 group">
            <Image
              src="/logo.jpg"
              alt="Taivillavungtau Logo"
              width={176}
              height={176}
              className="w-full h-full object-contain transform transition-transform duration-700 group-hover:scale-110"
              priority
            />
            {/* Bright gloss overlay on logo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/10 via-white/15 to-transparent pointer-events-none" />
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-logo pointer-events-none" />
          </div>
        </div>

        {/* Brand Name & Tagline - Clean White with Cyan Glow like Carousel */}
        <div className="space-y-3 mb-10">
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight animate-fade-in-up text-white uppercase"
            style={{ 
              textShadow: '0 2px 10px rgba(14, 165, 233, 0.4), 0 4px 20px rgba(20, 184, 166, 0.3), 0 8px 40px rgba(0,0,0,0.5)',
              fontFamily: 'var(--font-heading), "Playfair Display", serif',
              animationDelay: '300ms',
              letterSpacing: '-0.02em',
            }}
          >
            Taivillavungtau.vn
          </h1>
          <p 
            className="text-lg sm:text-xl md:text-2xl font-semibold max-w-3xl mx-auto leading-relaxed animate-fade-in-up text-white/90 tracking-[0.15em] uppercase"
            style={{ 
              textShadow: '0 2px 8px rgba(14, 165, 233, 0.3), 0 4px 16px rgba(0,0,0,0.4)',
              animationDelay: '500ms' 
            }}
          >
            Chuỗi cung ứng dịch vụ lưu trú tại Vũng Tàu
          </p>
        </div>

        {/* Feature Highlights Grid - Brighter Ocean Glass Effect */}
        <div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 max-w-5xl mx-auto"
          suppressHydrationWarning
        >
          {[
            { icon: Home, title: "Hàng Trăm Mẫu", desc: "Villa, Homestay, Căn hộ", delay: '600ms', color: 'from-cyan-400 to-cyan-500' },
            { icon: CheckCircle, title: "Chất Lượng Thật", desc: "Đảm bảo giống 100% ảnh", delay: '750ms', color: 'from-teal-400 to-teal-500' },
            { icon: Music, title: "Giải Trí Đỉnh Cao", desc: "Karaoke, Bi-A, Hồ bơi", delay: '900ms', color: 'from-sky-400 to-sky-500' },
            { icon: Bike, title: "Dịch Vụ Trọn Gói", desc: "Xe máy, BBQ, Xe điện", delay: '1050ms', color: 'from-emerald-400 to-emerald-500' }
          ].map((item, i) => (
            <Card 
              key={i} 
              className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 sm:p-5 rounded-2xl hover:bg-white/20 transition-all duration-500 hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-[0_10px_40px_rgba(34,211,238,0.25)] group animate-fade-in-up"
              style={{ animationDelay: item.delay }}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]`}>
                  <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-md" />
                </div>
                <h3 
                  className="font-semibold text-sm sm:text-base mb-1.5 text-white group-hover:text-cyan-200 transition-colors uppercase tracking-wide"
                  style={{ 
                    textShadow: '0 2px 8px rgba(14, 165, 233, 0.3), 0 4px 12px rgba(0,0,0,0.3)',
                    fontFamily: 'var(--font-heading), "Playfair Display", serif'
                  }}
                >{item.title}</h3>
                <p className="text-xs sm:text-sm text-cyan-100/80 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Progress indicator - Ocean themed */}
        <div className="mt-8 sm:mt-10 flex justify-center items-center gap-3" suppressHydrationWarning>
          <Waves className="w-4 h-4 text-cyan-400/60 animate-wave" />
          <div className="w-48 sm:w-64 h-1.5 bg-white/15 rounded-full overflow-hidden backdrop-blur-sm relative border border-cyan-400/20">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 rounded-full relative"
              style={{
                animation: `progressBar ${autoAdvanceDelay}ms linear`,
                boxShadow: '0 0 20px rgba(34, 211, 238, 0.6), 0 0 40px rgba(20, 184, 166, 0.3)'
              }}
            >
              {/* Glowing Comet Head */}
              <div className="absolute top-0 right-0 h-full w-10 bg-gradient-to-r from-transparent via-white/50 to-white blur-sm" />
              <Sparkles className="absolute -top-3 -right-2 w-4 h-4 text-cyan-300 animate-pulse" />
            </div>
          </div>
          <Waves className="w-4 h-4 text-cyan-400/60 animate-wave" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes progressBar {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes kenBurns {
          0% { transform: scale(1.1) translate(0, 0); }
          50% { transform: scale(1.15) translate(-0.5%, -0.5%); }
          100% { transform: scale(1.1) translate(0, 0); }
        }
        .animate-ken-burns {
          animation: kenBurns 25s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .animate-shimmer {
          animation: shimmer 4s ease-in-out infinite;
        }
        @keyframes shimmerLogo {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-shimmer-logo {
          animation: shimmerLogo 3s ease-in-out infinite;
        }
        @keyframes floatBubble {
          0%, 100% { 
            transform: translateY(100vh) translateX(0) scale(0.5);
            opacity: 0;
          }
          10% { opacity: 0.8; transform: translateY(80vh) scale(0.8); }
          50% { 
            transform: translateY(40vh) translateX(30px) scale(1);
            opacity: 0.6;
          }
          90% { opacity: 0.4; }
          100% { 
            transform: translateY(-10vh) translateX(-20px) scale(0.5);
            opacity: 0;
          }
        }
        @keyframes wave {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-2px) rotate(-5deg); }
          75% { transform: translateY(2px) rotate(5deg); }
        }
        .animate-wave {
          animation: wave 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}