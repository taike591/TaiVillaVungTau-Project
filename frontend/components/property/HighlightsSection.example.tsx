import { HighlightsSection } from './HighlightsSection';
import { Waves, Droplet, ChefHat, Wifi, Wind, Car, Sparkles, Shield } from 'lucide-react';

export default function HighlightsSectionExample() {
  // Example 1: Using default highlights
  const defaultExample = (
    <div className="space-y-8 p-8 bg-gray-50">
      <div>
        <h3 className="text-xl font-bold mb-4">Default Highlights</h3>
        <HighlightsSection />
      </div>
    </div>
  );

  // Example 2: Custom highlights
  const customHighlights = [
    {
      icon: Waves,
      title: 'Beachfront Access',
      description: 'Direct access to pristine white sand beach',
    },
    {
      icon: Droplet,
      title: 'Infinity Pool',
      description: 'Stunning infinity pool overlooking the ocean',
    },
    {
      icon: Sparkles,
      title: 'Luxury Amenities',
      description: 'Premium furnishings and high-end appliances',
    },
    {
      icon: Shield,
      title: '24/7 Security',
      description: 'Gated community with round-the-clock security',
    },
  ];

  const customExample = (
    <div className="space-y-8 p-8 bg-gray-50">
      <div>
        <h3 className="text-xl font-bold mb-4">Custom Highlights</h3>
        <HighlightsSection highlights={customHighlights} />
      </div>
    </div>
  );

  return (
    <div className="space-y-12">
      {defaultExample}
      {customExample}
    </div>
  );
}
