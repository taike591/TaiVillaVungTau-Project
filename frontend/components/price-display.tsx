'use client';

import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { formatVillaPrice, PRICE_DISCLAIMERS } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface PriceDisplayProps {
  weekdayPrice: number;
  weekendPrice?: number;
  guestCount: number;
  roomCount?: number;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

/**
 * PriceDisplay Component
 * Displays villa pricing with tropical styling
 * Requirements: 12.1, 12.2, 12.3, 12.4, 12.5
 */
export function PriceDisplay({
  weekdayPrice,
  weekendPrice,
  guestCount,
  roomCount,
  variant = 'default',
  className = '',
}: PriceDisplayProps) {
  const formattedWeekdayPrice = formatVillaPrice(weekdayPrice, guestCount, roomCount);
  const formattedWeekendPrice = weekendPrice 
    ? formatVillaPrice(weekendPrice, guestCount, roomCount)
    : null;

  const t = useTranslations('pricing');

  if (variant === 'compact') {
    return (
      <div className={`space-y-2 ${className}`} suppressHydrationWarning>
        {/* Weekday Price - Requirements 12.1, 12.2 */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-extrabold text-gradient-sunset min-h-[3.5rem] flex items-center">
            {formattedWeekdayPrice}
          </span>
        </div>
        <Badge variant="coral" className="text-xs">
          {t('weekdayPrice')}
        </Badge>
      </div>
    );
  }

  return (
    <Card className={`bg-gradient-warm-glow border-[var(--tropical-orange-100)] flex flex-col ${className}`} suppressHydrationWarning>
      <CardContent className="p-3 flex flex-col flex-grow justify-between">
        {/* Weekday Price - Requirements 12.1, 12.2 */}
        <div className="mb-2">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-lg md:text-xl font-extrabold text-gradient-sunset flex items-center leading-tight">
              {formattedWeekdayPrice}
            </span>
          </div>
          <Badge variant="coral" className="text-[10px] px-2 h-5">
            {t('weekdayPrice')} ({t('monToThu')})
          </Badge>
        </div>

        {/* Weekend Price - Requirements 12.3 */}
        {formattedWeekendPrice && (
          <div className="mb-2 pb-2 border-b border-[var(--tropical-orange-100)]">
            <div className="text-xs text-[var(--warm-gray-700)] mb-1">
              <span className="font-semibold">{t('weekendPrice')}: </span>
              <span className="font-bold text-[var(--tropical-orange-600)]">
                {formattedWeekendPrice}
              </span>
            </div>
            <Badge variant="yellow" className="text-[10px] px-2 h-5">
              {t('friToSun')}
            </Badge>
          </div>
        )}

        {/* Price Disclaimers - Requirements 12.4, 12.5 */}
        {variant === 'detailed' && (
          <div className="space-y-0.5">
            <p className="text-[10px] text-[var(--warm-gray-600)] italic leading-tight">
              * {PRICE_DISCLAIMERS.seasonal}
            </p>
            <p className="text-[10px] text-[var(--warm-gray-600)] italic leading-tight">
              * {PRICE_DISCLAIMERS.holiday}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
