'use client';

import { LucideIcon, Waves, Droplet, ChefHat, Wifi, Wind, Car } from 'lucide-react';

interface PropertyHighlight {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface HighlightsSectionProps {
  highlights?: PropertyHighlight[];
}

// Default highlights if none provided
const DEFAULT_HIGHLIGHTS: PropertyHighlight[] = [
  {
    icon: Waves,
    title: 'Ocean View',
    description: 'Stunning views of the sea',
  },
  {
    icon: Droplet,
    title: 'Private Pool',
    description: 'Exclusive pool for your group',
  },
  {
    icon: ChefHat,
    title: 'Modern Kitchen',
    description: 'Fully equipped for cooking',
  },
  {
    icon: Wifi,
    title: 'Free WiFi',
    description: 'High-speed internet included',
  },
  {
    icon: Wind,
    title: 'Air Conditioning',
    description: 'Climate control in all rooms',
  },
  {
    icon: Car,
    title: 'Parking',
    description: 'Free on-site parking',
  },
];

export function HighlightsSection({ highlights }: HighlightsSectionProps) {
  const displayHighlights = highlights && highlights.length > 0 ? highlights : DEFAULT_HIGHLIGHTS;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[var(--navy-slate-900)]">
        Điểm nổi bật
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayHighlights.map((highlight, index) => {
          const Icon = highlight.icon;
          
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-warm-md hover:shadow-warm-lg transition-shadow duration-300 p-6"
            >
              {/* Icon with circular background */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--ocean-blue-500)] bg-opacity-10 flex items-center justify-center">
                  <Icon 
                    className="h-6 w-6 text-[var(--ocean-blue-500)]" 
                    strokeWidth={2}
                  />
                </div>
                
                {/* Title and Description */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-[var(--navy-slate-900)] mb-1">
                    {highlight.title}
                  </h3>
                  <p className="text-sm text-[var(--navy-slate-600)] leading-relaxed">
                    {highlight.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
