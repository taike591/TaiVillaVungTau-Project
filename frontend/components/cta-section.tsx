"use client";

import { Button } from "@/components/ui/button";
import { Clock, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from 'next-intl';

interface CTASectionProps {
  className?: string;
  variant?: "default" | "compact";
  showWorkingHours?: boolean;
}

/**
 * Call-to-Action Section Component
 * 
 * A reusable CTA component with tropical sunset styling featuring:
 * - Zalo contact button with phone number
 * - Working hours display
 * - Engaging hover animations
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
 */
export function CTASection({
  className,
  variant = "default",
  showWorkingHours = true,
}: CTASectionProps) {
  const handleZaloClick = () => {
    // Open Zalo with the phone number
    window.open("https://zalo.me/0868947734", "_blank");
  };

  const handlePhoneClick = () => {
    window.location.href = "tel:0868947734";
  };

  const t = useTranslations('cta');

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex flex-col sm:flex-row items-center justify-center gap-4 p-6 rounded-2xl bg-gradient-sunset shadow-warm-lg",
          className
        )}
      >
        <Button
          onClick={handleZaloClick}
          size="lg"
          className="bg-white text-ocean-blue-600 hover:bg-white/90 hover:scale-105 transition-all shadow-warm-md hover:shadow-warm-lg font-bold"
        >
          <Phone className="size-5" />
          {t('contactZalo')}
        </Button>
        
        {showWorkingHours && (
          <div className="flex items-center gap-2 text-white font-semibold">
            <Clock className="size-5" />
            <span>7AM-10PM</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-gradient-sunset py-16 px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-sand-gold-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-ocean-blue-600 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 animate-fade-in-warm">
          {t('readyToBook')}
        </h2>
        
        <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          {t('contactDescription')}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Button
            onClick={handleZaloClick}
            size="lg"
            className="bg-white text-ocean-blue-600 hover:bg-white/90 hover:scale-105 transition-all shadow-warm-lg hover:shadow-warm-xl font-bold text-base sm:text-lg px-8 py-6 h-auto"
          >
            <Phone className="size-6" />
            {t('contactZalo')}
          </Button>

          <Button
            onClick={handlePhoneClick}
            size="lg"
            variant="outline"
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-ocean-blue-600 hover:scale-105 transition-all font-bold text-base sm:text-lg px-8 py-6 h-auto"
          >
            <Phone className="size-6" />
            {t('callNow')}
          </Button>
        </div>

        {/* Working Hours */}
        {showWorkingHours && (
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white font-semibold">
            <Clock className="size-5" />
            <span className="text-base">{t('workingHours')}</span>
          </div>
        )}
      </div>
    </section>
  );
}
