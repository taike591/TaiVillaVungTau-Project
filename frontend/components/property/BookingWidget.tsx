'use client';

import { PriceDisplay } from '@/components/price-display';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Waves, CheckCircle, Facebook } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface BookingWidgetProps {
  weekdayPrice: number;
  weekendPrice?: number;
  priceNote?: string;
  distanceToSea?: string;
  facebookLink?: string;
  propertyCode: string;
  standardGuests: number;
  bedroomCount: number;
}

/**
 * BookingWidget Component
 * Enhanced sticky sidebar for pricing and booking actions
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 7.1, 7.2
 */
export function BookingWidget({
  weekdayPrice,
  weekendPrice,
  priceNote,
  distanceToSea,
  facebookLink,
  propertyCode,
  standardGuests,
  bedroomCount,
}: BookingWidgetProps) {
  const t = useTranslations('booking');

  return (
    <div 
      className="w-full lg:w-96 bg-white rounded-2xl shadow-warm-xl border border-[var(--ocean-blue-100)] p-8 sticky top-20"
      style={{
        boxShadow: '0 20px 25px -5px rgba(14, 116, 144, 0.1), 0 10px 10px -5px rgba(14, 116, 144, 0.04)'
      }}
    >
      {/* Price Display - Requirements 3.1, 3.2 */}
      <div className="mb-6">
        <PriceDisplay
          weekdayPrice={weekdayPrice}
          weekendPrice={weekendPrice}
          guestCount={standardGuests}
          roomCount={bedroomCount}
          variant="detailed"
        />
      </div>

      {/* Price Notes - Requirement 3.3 */}
      {priceNote && (
        <Alert variant="warning" className="mb-6">
          <AlertDescription className="text-sm">
            <div className="font-semibold text-[var(--tropical-yellow-900)] mb-1">
              {t('priceNote')}:
            </div>
            <div className="text-[var(--tropical-yellow-800)]">
              {priceNote}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Distance to Sea - Requirement 7.2 */}
      {distanceToSea && (
        <div className="mb-6 flex items-center gap-2 text-[var(--ocean-blue-600)]">
          <Waves className="w-5 h-5" />
          <span className="text-sm font-medium">
            {t('distanceToBeach')}: {distanceToSea}
          </span>
        </div>
      )}

      {/* Primary CTA Button - Requirement 3.4 */}
      <Link href={`/contact?propertyCode=${propertyCode}`} className="block mb-3">
        <Button 
          variant="ocean"
          size="lg" 
          className="w-full font-bold hover-glow-cyan"
        >
          {t('requestConsultation')}
        </Button>
      </Link>

      {/* Secondary Facebook Button - Requirement 3.5 */}
      {facebookLink && (
        <a 
          href={facebookLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block mb-6"
        >
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full border-[var(--ocean-blue-600)] text-[var(--ocean-blue-600)] hover:bg-[var(--ocean-blue-50)]"
          >
            <Facebook className="w-5 h-5" />
            {t('viewOnFacebook')}
          </Button>
        </a>
      )}

      {/* Trust Indicators - Requirements 7.1, 7.2 */}
      <div className="pt-6 border-t border-gray-200 space-y-3">
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
          <span>{t('freeCancel')}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
          <span>{t('support247')}</span>
        </div>
      </div>
    </div>
  );
}
