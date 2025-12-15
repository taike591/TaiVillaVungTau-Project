'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Home, CheckCircle, Music, Bike } from 'lucide-react';
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
    // Đã đổi text-white thành text-gray-100 để màu sắc dịu mắt hơn một chút nhưng vẫn sáng
    <div 
      suppressHydrationWarning
      className={`fixed inset-0 z-[100] flex items-center justify-center text-gray-100 transition-opacity duration-700 ease-in-out ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ isolation: 'isolate' }}
    >
      {/* Background Image with Overlay */}
      <div 
        suppressHydrationWarning
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/villa-collage.jpg")',
        }}
      />
      
      {/* --- THAY ĐỔI QUAN TRỌNG 1: Tăng độ tối của lớp phủ --- */}
      {/* Từ black/40 -> black/70 để tạo độ tương phản mạnh hơn */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80" />
      
      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center relative z-10">
        {/* Logo */}
        <div className="mb-8 animate-fade-in-scale">
          {/* Thêm viền sáng nhẹ cho logo */}
          <div className="w-48 h-48 mx-auto mb-6 relative rounded-2xl shadow-[0_0_25px_rgba(255,255,255,0.2)]">
            <Image
              src="/logo.jpg"
              alt="Taivillavungtau Logo"
              width={192}
              height={192}
              className="w-full h-full object-contain rounded-2xl"
              priority
            />
          </div>
        </div>

        {/* Slogan */}
        {/* Sử dụng text-white và tăng cường text-shadow */}
        <h1 
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-wider animate-fade-in-up text-white"
          style={{ 
            // Bóng đổ mạnh hơn và sắc nét hơn để tách biệt khỏi nền
            textShadow: '0 2px 4px rgba(0,0,0,0.5), 0 8px 30px rgba(0,0,0,0.5)',
            animationDelay: '200ms'
          }}
        >
          Taivillavungtau.vn
        </h1>

        {/* Tagline */}
        {/* Sử dụng màu sáng (gray-200) thay vì trắng tinh để tạo thứ bậc, vẫn giữ bóng đổ */}
        <p 
          className="text-lg sm:text-xl md:text-2xl font-bold mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up text-blue-100"
          style={{ 
            textShadow: '0 2px 4px rgba(0,0,0,0.8)',
            animationDelay: '400ms' 
          }}
        >
          HỆ THỐNG VILLA, NHÀ PHỐ, CĂN HỘ DU LỊCH LỚN NHẤT TẠI VŨNG TÀU
        </p>

        {/* Feature Highlights Grid */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto animate-fade-in-up"
          style={{ animationDelay: '600ms' }}
        >
          {/* --- THAY ĐỔI QUAN TRỌNG 2: Đổi style của Card sang "Dark Glass" --- */}
          {/* Thay vì bg-white/15, dùng bg-black/40 để chữ trắng nổi bật trên nền tối mờ */}
          
          {/* Feature 1 */}
          <Card className="bg-black/40 backdrop-blur-lg border-white/10 p-6 rounded-xl hover:bg-black/50 transition-all duration-300 hover:transform hover:scale-105 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 border border-white/20">
                {/* Icon màu vàng nhạt hoặc trắng sáng */}
                <Home className="w-8 h-8 text-yellow-100" />
              </div>
              <h3 className="font-bold text-base sm:text-lg mb-2 text-white">Hàng Trăm Mẫu</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Villa, Homestay, Nhà phố, Căn Hộ
              </p>
            </div>
          </Card>

          {/* Feature 2 */}
          <Card className="bg-black/40 backdrop-blur-lg border-white/10 p-6 rounded-xl hover:bg-black/50 transition-all duration-300 hover:transform hover:scale-105 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 border border-white/20">
                <CheckCircle className="w-8 h-8 text-yellow-100" />
              </div>
              <h3 className="font-bold text-base sm:text-lg mb-2 text-white">Cam Kết Chất Lượng</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Đảm bảo giống mẫu và hình ảnh
              </p>
            </div>
          </Card>

          {/* Feature 3 */}
          <Card className="bg-black/40 backdrop-blur-lg border-white/10 p-6 rounded-xl hover:bg-black/50 transition-all duration-300 hover:transform hover:scale-105 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 border border-white/20">
                <Music className="w-8 h-8 text-yellow-100" />
              </div>
              <h3 className="font-bold text-base sm:text-lg mb-2 text-white">Giải Trí Đầy Đủ</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Bi-A, karaoke, bồn sục, phòng xông hơi
              </p>
            </div>
          </Card>

          {/* Feature 4 */}
          <Card className="bg-black/40 backdrop-blur-lg border-white/10 p-6 rounded-xl hover:bg-black/50 transition-all duration-300 hover:transform hover:scale-105 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 border border-white/20">
                <Bike className="w-8 h-8 text-yellow-100" />
              </div>
              <h3 className="font-bold text-base sm:text-lg mb-2 text-white">Hỗ Trợ Dịch Vụ</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Thuê xe máy, phao, xe điện, tổ chức đại tiệc
              </p>
            </div>
          </Card>
        </div>

        {/* Progress indicator */}
        <div className="mt-12 flex justify-center">
          {/* Làm thanh nền tối hơn một chút */}
          <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              // Thanh tiến trình màu trắng sáng, có thêm hiệu ứng phát sáng nhẹ
              className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.7)]"
              style={{
                animation: `progressBar ${autoAdvanceDelay}ms linear`
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progressBar {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}