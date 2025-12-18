'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Phone, CheckCircle, Clock, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface PropertyDetailPricingCardProps {
  weekdayPrice: number;
  weekendPrice?: number;
  standardGuests: number;
  maxGuests: number;
  priceNote?: string;
  distanceToSea?: string;
  facebookLink?: string;
  className?: string;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}

export function PropertyDetailPricingCard({
  weekdayPrice,
  weekendPrice,
  standardGuests,
  maxGuests,
  priceNote,
  distanceToSea,
  facebookLink,
  className,
}: PropertyDetailPricingCardProps) {
  const [isRippling, setIsRippling] = useState(false);

  const handleCTAClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsRippling(true);
    setTimeout(() => setIsRippling(false), 600);
  };

  const t = useTranslations('pricing');

  return (
    <Card className={cn(
      "overflow-hidden border-0 shadow-xl shadow-slate-200/50",
      "animate-fade-in-up",
      className
    )}>
      {/* Header - Starting Price */}
      <div className="p-6 pb-4 border-b border-slate-100">
        <p className="text-sm text-slate-500 mb-1">{t('startingFrom')}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-[#0891b2]">
            {formatPrice(weekdayPrice)}
          </span>
        </div>
        <p className="text-sm text-slate-400 mt-1">
          / {standardGuests} {t('guests')} / {t('night')}
        </p>
      </div>

      {/* Price Tabs */}
      <div className="p-4 space-y-3">
        {/* Weekday Price */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#e0f2fe] border border-[#7dd3fc]">
          <div className="w-1.5 h-10 rounded-full bg-[#0891b2]" />
          <div className="flex-1">
            <p className="text-xs font-semibold text-[#0c4a6e] uppercase tracking-wide">
              {t('weekdayPrice')}
            </p>
            <p className="text-xs text-[#0369a1]">{t('monToThu')}</p>
          </div>
          <Badge className="bg-[#0891b2] hover:bg-[#0891b2] text-white font-semibold">
            {formatPrice(weekdayPrice)}
          </Badge>
        </div>

        {/* Weekend Price */}
        {weekendPrice && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#ffedd5] border border-[#fdba74]">
            <div className="w-1.5 h-10 rounded-full bg-[#f97316]" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-[#9a3412] uppercase tracking-wide">
                {t('weekendPrice')}
              </p>
              <p className="text-xs text-[#c2410c]">{t('friToSun')}</p>
            </div>
            <Badge className="bg-[#f97316] hover:bg-[#f97316] text-white font-semibold">
              {formatPrice(weekendPrice)}
            </Badge>
          </div>
        )}
      </div>

      {/* Price Notes
      {priceNote && (
        <div className="px-4 pb-2">
          <p className="text-xs text-slate-500 italic">
            * {priceNote}
          </p>
        </div>
      )} */}

      {/* Price Disclaimers - PROMINENT Warning Style */}
      <div className="mx-4 mb-4 p-5 bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 border-2 border-amber-300 rounded-2xl shadow-lg shadow-amber-200/50">
        <div className="space-y-3">
          <div className="flex items-start gap-3 text-amber-900">
            <span className="text-2xl">⚠️</span>
            <p className="text-sm font-semibold leading-relaxed">
              {t('priceDisclaimer1')}
            </p>
          </div>
          <div className="flex items-start gap-3 text-orange-800">
            <span className="text-2xl">🔥</span>
            <p className="text-sm font-bold leading-relaxed">
              Giá Thứ 6, Thứ 7, Chủ nhật, Lễ, Tết có thay đổi
            </p>
          </div>
          <div className="flex items-center gap-3 pt-2 border-t border-amber-200">
            <span className="text-2xl animate-pulse">☎️</span>
            <p className="text-base font-extrabold text-[#0891b2] tracking-wide">
              Vui lòng liên hệ để có giá chính xác !!
            </p>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="p-4 pt-2 space-y-3">
        <Button
          asChild
          size="lg"
          onClick={handleCTAClick}
          className={cn(
            "w-full h-14 text-base font-bold rounded-xl relative overflow-hidden",
            "bg-gradient-to-r from-[#0891b2] to-[#0ea5e9]",
            "hover:from-[#0e7490] hover:to-[#0284c7]",
            "shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30",
            "transform transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0",
            isRippling && "animate-pulse"
          )}
        >
          <a href="https://zalo.me/84868947734" target="_blank" rel="noopener noreferrer" suppressHydrationWarning>
            <MessageCircle className="w-5 h-5 mr-2" />
            {t('requestConsultation')}
          </a>
        </Button>

        <Button
          asChild
          variant="outline"
          size="lg"
          className={cn(
            "w-full h-12 text-base font-semibold rounded-xl",
            "border-2 border-slate-200 hover:border-[#0891b2]",
            "hover:bg-[#f0f9ff] hover:text-[#0891b2]",
            "transition-all duration-300"
          )}
        >
          <a href="tel:0868947734" suppressHydrationWarning>
            <Phone className="w-4 h-4 mr-2" />
            0868-947-734
          </a>
        </Button>
      </div>

     
    </Card>
  );
}
