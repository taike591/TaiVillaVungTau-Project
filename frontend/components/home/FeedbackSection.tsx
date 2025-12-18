"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

const useInView = (threshold = 0.1) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold });
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return [setRef, isVisible] as const;
};

const useCounter = (end: number, duration: number = 2000, trigger: boolean = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(progress * end);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration, trigger]);

  return count;
};

const AnimatedNumber = ({ value, duration, decimals = 0, suffix = "" }: { value: number, duration?: number, decimals?: number, suffix?: string }) => {
  const [setRef, isVisible] = useInView();
  const count = useCounter(value, duration, isVisible);

  return (
    <span ref={setRef}>
      {count.toFixed(decimals)}{suffix}
    </span>
  );
};

export default function FeedbackSection() {
  const t = useTranslations('home');
  const tCommon = useTranslations('common');

  return (
    <section 
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 40%, #f8fafc 100%)',
      }}
      aria-labelledby="feedback-heading"
    >
      {/* Seamless top wave connection */}
      <div className="absolute top-0 left-0 right-0 h-24 overflow-hidden -mt-1">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-full" fill="#e0f2fe">
          <path d="M0,0 L1440,0 L1440,40 C1200,100 960,0 720,60 C480,100 240,0 0,40 Z"/>
        </svg>
      </div>

      {/* Decorative seashells */}
      <div className="absolute top-32 right-16 w-40 h-40 opacity-[0.05] pointer-events-none">
        <svg viewBox="0 0 100 100" fill="currentColor" className="text-[#0c4a6e]">
          <path d="M50,10 C30,10 15,30 15,50 C15,75 35,90 50,90 C65,90 85,75 85,50 C85,30 70,10 50,10 M25,50 Q50,35 75,50 M30,60 Q50,45 70,60 M35,70 Q50,55 65,70"/>
        </svg>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1300px] relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 rounded-full bg-white shadow-lg shadow-slate-200/50 border border-slate-100">
            <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
            </svg>
            <span className="text-slate-700 text-sm font-semibold tracking-wide uppercase">{t('fanpageReviews')}</span>
          </div>
          <h2 id="feedback-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0c4a6e] mb-6">
            {t('customersLove')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fb7185] to-[#f43f5e]">
              {t('whatTheySay')}
            </span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
            {t('reviewsDescription')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[1, 2, 3, 4, 5, 6].map((id, index) => (
            <div key={id} className={cn("group relative", index % 2 === 1 && "lg:mt-12")}>
              <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-xl shadow-gray-200/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <Image
                  src={`/fb${id}.png`}
                  alt={`Review #${id}`}
                  width={400}
                  height={300}
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 400px"
                  className="w-full h-auto block"
                  loading="lazy"
                />
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(s => (
                        <svg key={s} className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-gray-600 font-semibold">5.0</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 rounded-full border border-green-100">
                    <span className="text-[10px] text-green-600 font-bold uppercase tracking-wide">Xác thực</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 md:mt-20 text-center">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 mb-12">
            <div className="text-center">
              <div className="text-gray-900 text-3xl font-bold">
                <AnimatedNumber value={5.0} decimals={1} duration={2500} suffix=" / 5.0" />
              </div>
              <p className="text-gray-500 text-sm">{t('averageRating')}</p>
            </div>
            <div className="text-center">
              <div className="text-[#0ea5e9] text-3xl font-bold">
                <AnimatedNumber value={100} duration={3000} suffix="+" />
              </div>
              <p className="text-gray-500 text-sm">{t('fiveStarReviews')}</p>
            </div>
            <div className="text-center">
              <div className="text-green-500 text-3xl font-bold">
                <AnimatedNumber value={100} duration={2000} suffix="%" />
              </div>
              <p className="text-gray-500 text-sm">{t('satisfiedCustomers')}</p>
            </div>
          </div>
          
          <a 
            href="https://www.facebook.com/profile.php?id=100091682560247&sk=reviews" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-[#1877F2] text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300"
          >
            <span>{t('viewAllFacebookReviews')}</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
