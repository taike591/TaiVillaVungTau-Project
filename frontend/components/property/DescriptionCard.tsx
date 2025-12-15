'use client';

interface DescriptionCardProps {
  description: string;
  bedConfig?: string;
}

import { useTranslations } from 'next-intl';

export function DescriptionCard({ description, bedConfig }: DescriptionCardProps) {
  const t = useTranslations('propertyDetail');
  return (
    <div className="bg-white rounded-xl shadow-warm-md p-8">
      {/* Section Title */}
      <h2 className="text-2xl font-semibold text-[var(--ocean-blue-600)] mb-4">
        {t('description')}
      </h2>

      {/* Description Text with Preserved Line Breaks */}
      <div className="text-base text-[var(--navy-slate-700)] whitespace-pre-wrap mb-4" style={{ lineHeight: '1.7' }}>
        {description}
      </div>

      {/* Bed Configuration Highlight Box */}
      {bedConfig && (
        <div className="bg-[var(--sand-gold-50)] border border-[var(--sand-gold-200)] rounded-lg p-4 mt-4">
          <p className="text-sm font-semibold text-[var(--sand-gold-700)] mb-1">
            {t('bedConfiguration')}:
          </p>
          <p className="text-base text-[var(--sand-gold-900)]">
            {bedConfig}
          </p>
        </div>
      )}
    </div>
  );
}
