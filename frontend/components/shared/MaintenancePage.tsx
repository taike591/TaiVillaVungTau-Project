'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface MaintenancePageProps {
  onRetry?: () => void;
  message?: string;
}

export default function MaintenancePage({ 
  onRetry,
  message = 'Hệ thống đang được bảo trì để phục vụ bạn tốt hơn!'
}: MaintenancePageProps) {
  const [dots, setDots] = useState('');
  
  // Animated loading dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e0f2fe] via-[#f0f9ff] to-[#e0f2fe] flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl animate-bounce" style={{ animationDuration: '3s' }}>🌴</div>
        <div className="absolute top-40 right-20 text-5xl animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>🏖️</div>
        <div className="absolute bottom-32 left-1/4 text-4xl animate-bounce" style={{ animationDuration: '2s', animationDelay: '1s' }}>🐚</div>
        <div className="absolute bottom-20 right-1/3 text-5xl animate-bounce" style={{ animationDuration: '2.8s', animationDelay: '0.3s' }}>🌊</div>
        <div className="absolute top-1/3 left-1/3 text-3xl animate-pulse">⭐</div>
        <div className="absolute bottom-1/3 right-1/4 text-3xl animate-pulse" style={{ animationDelay: '0.7s' }}>✨</div>
      </div>

      <div className="relative z-10 max-w-lg w-full">
        {/* Main card */}
        <div 
          className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-8 md:p-12 text-center shadow-2xl shadow-cyan-200/30 border border-white"
        >
          {/* Cute villa illustration */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-full animate-pulse" />
            <div className="relative flex items-center justify-center h-full">
              <span className="text-7xl">🏠</span>
            </div>
            {/* Sleeping z's */}
            <div className="absolute -top-2 -right-2 text-2xl animate-bounce" style={{ animationDuration: '1s' }}>💤</div>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
            Đang nghỉ ngơi chút xíu{dots}
          </h1>

          {/* Message */}
          <p className="text-slate-600 text-lg mb-6 leading-relaxed">
            {message}
          </p>

          {/* Cute message */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full border border-amber-100 mb-8">
            <span className="text-xl">🔧</span>
            <span className="text-amber-700 text-sm font-medium">Đội ngũ kỹ thuật đang xử lý</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-slate-100 rounded-full mb-8 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full animate-pulse"
              style={{ width: '60%' }}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-full shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Thử lại
              </button>
            )}
            
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-full hover:border-cyan-300 hover:text-cyan-600 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Về trang chủ
            </Link>
          </div>

          {/* Contact info */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-slate-500 text-sm mb-3">Cần hỗ trợ gấp? Liên hệ ngay:</p>
            <div className="flex items-center justify-center gap-4">
              <a 
                href="tel:0868947734"
                className="flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-full hover:bg-teal-100 transition-colors"
              >
                <span className="text-lg">📞</span>
                <span className="font-semibold">0868 947 734</span>
              </a>
              <a 
                href="https://zalo.me/0868947734"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
              >
                <span className="font-bold">Z</span>
                <span className="font-semibold">Zalo</span>
              </a>
            </div>
          </div>
        </div>

        {/* Fun fact */}
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm italic">
            💡 Bạn biết không? Villa đẹp nhất ở Vũng Tàu đang chờ bạn khám phá!
          </p>
        </div>
      </div>
    </div>
  );
}
