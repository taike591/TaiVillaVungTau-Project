import { Suspense } from 'react';
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PropertiesClient } from "@/components/property/PropertiesClient";
import { Skeleton } from "@/components/ui/skeleton";

import { PropertyCardSkeleton as SharedPropertyCardSkeleton } from "@/components/shared/LoadingState";

function PropertiesLoading() {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="lg:w-64 shrink-0">
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </aside>
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SharedPropertyCardSkeleton count={6} />
        </div>
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1">
        {/* Hero Header with Vung Tau Background */}
        <section className="relative text-white py-14 md:py-20 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transform hover:scale-105 transition-transform duration-[10s] ease-out"
              style={{ backgroundImage: 'url("/vungtau.jpg")' }}
            />
            {/* Gradient Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/80 to-transparent" />
          </div>

          {/* Background Pattern Overlay (Optional) */}
          <div className="absolute inset-0 opacity-10 z-0 pointer-events-none">
             <div className="absolute inset-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
          </div>
          
          {/* Content */}
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl animate-in slide-in-from-left-10 duration-700 fade-in">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs text-blue-200 mb-3 backdrop-blur-sm bg-black/20 inline-flex px-3 py-1 rounded-full border border-white/10">
                <span>🏠</span>
                <span>/</span>
                <span className="text-white font-medium">Danh Sách Villa</span>
              </div>
              
              {/* Main Title */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight drop-shadow-lg">
                <span className="text-white">
                Taivillavungtau
                </span>
                <br />
                
              </h1>
              
              {/* Subtitle */}
              <p className="text-base md:text-lg text-blue-50 mb-6 max-w-xl leading-relaxed drop-shadow-md">
                Trải nghiệm kỳ nghỉ hoàn hảo với các villa cao cấp view biển, 
                hồ bơi riêng và tiện nghi đẳng cấp 5 sao
              </p>
              
              {/* Stats */}
              <div className="flex flex-wrap gap-3 text-xs md:text-sm">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full hover:bg-white/30 transition-colors cursor-default">
                  <span className="text-lg">🏡</span>
                  <span className="font-medium">100+ Villa</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full hover:bg-white/30 transition-colors cursor-default">
                  <span className="text-lg">⭐</span>
                  <span className="font-medium">Đánh giá 5.0</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full hover:bg-white/30 transition-colors cursor-default">
                  <span className="text-lg">🏖️</span>
                  <span className="font-medium">Nhiều vị trí</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Wave - More subtle to blend with image */}
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <svg className="w-full h-16 md:h-24 opacity-90" viewBox="0 0 1440 74" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
               <path d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,42.7C960,43,1056,53,1152,53.3C1248,53,1344,43,1392,37.3L1440,32V74H1392C1344,74,1248,74,1152,74C1056,74,960,74,864,74C768,74,672,74,576,74C480,74,384,74,288,74C192,74,96,74,48,74H0V32Z" fill="#F9FAFB"/>
            </svg>
          </div>
        </section>

        {/* Content */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <Suspense fallback={<PropertiesLoading />}>
              <PropertiesClient />
            </Suspense>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
