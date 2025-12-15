# HighlightsSection Component

## Overview

The `HighlightsSection` component displays unique property features and selling points in an attractive grid layout. It showcases key highlights with icons, titles, and descriptions to help potential guests understand what makes the property special.

## Features

- **Responsive Grid Layout**: 3 columns on desktop, 2 on tablet, 1 on mobile
- **Icon-based Cards**: Each highlight features a circular icon background with ocean theme styling
- **Default Highlights**: Automatically displays 6 default highlights if none are provided
- **Customizable**: Accepts custom highlights with any lucide-react icon
- **Ocean Theme**: Consistent styling with shadow-warm-md and ocean-blue-500 colors
- **Hover Effects**: Smooth shadow transitions on card hover

## Props

```typescript
interface HighlightsSectionProps {
  highlights?: PropertyHighlight[];
}

interface PropertyHighlight {
  icon: LucideIcon;
  title: string;
  description: string;
}
```

### Props Details

- `highlights` (optional): Array of custom highlights to display. If not provided or empty, default highlights will be shown.

## Default Highlights

When no highlights are provided, the component displays these 6 default highlights:

1. **Ocean View** - Stunning views of the sea
2. **Private Pool** - Exclusive pool for your group
3. **Modern Kitchen** - Fully equipped for cooking
4. **Free WiFi** - High-speed internet included
5. **Air Conditioning** - Climate control in all rooms
6. **Parking** - Free on-site parking

## Usage

### Basic Usage (Default Highlights)

```tsx
import { HighlightsSection } from '@/components/property/HighlightsSection';

export default function PropertyPage() {
  return (
    <div>
      <HighlightsSection />
    </div>
  );
}
```

### Custom Highlights

```tsx
import { HighlightsSection } from '@/components/property/HighlightsSection';
import { Waves, Sparkles, Shield, Utensils } from 'lucide-react';

export default function PropertyPage() {
  const customHighlights = [
    {
      icon: Waves,
      title: 'Beachfront Access',
      description: 'Direct access to pristine white sand beach',
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
    {
      icon: Utensils,
      title: 'Private Chef Available',
      description: 'Optional private chef service for your stay',
    },
  ];

  return (
    <div>
      <HighlightsSection highlights={customHighlights} />
    </div>
  );
}
```

## Design Specifications

- **Layout**: CSS Grid with responsive columns
  - Desktop (lg): 3 columns
  - Tablet (md): 2 columns
  - Mobile: 1 column
- **Gap**: 24px between cards
- **Card Styling**:
  - Background: White
  - Shadow: shadow-warm-md (hover: shadow-warm-lg)
  - Padding: 24px
  - Border Radius: 12px
- **Icon**:
  - Size: 48px container (24px icon)
  - Color: ocean-blue-500
  - Background: ocean-blue-500 with 10% opacity
  - Shape: Circular
- **Title**:
  - Font Size: 18px
  - Font Weight: Semibold
  - Color: navy-slate-900
- **Description**:
  - Font Size: 14px
  - Color: navy-slate-600
  - Line Height: Relaxed

## Accessibility

- Semantic HTML structure with proper heading hierarchy
- Icons are decorative and don't require alt text (titles provide context)
- Sufficient color contrast for text readability
- Responsive touch targets for mobile devices

## Related Components

- `SpecsCard` - Displays property specifications
- `AmenitiesGrid` - Shows detailed amenities list
- `PropertyHeader` - Property title and location

## Requirements

Validates Requirements:
- 12.1: Display special features in dedicated highlights section
- 12.2: Use icon-based cards with ocean theme styling
