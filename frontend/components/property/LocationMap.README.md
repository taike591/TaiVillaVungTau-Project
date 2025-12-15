# LocationMap Component

## Overview

The `LocationMap` component displays the property's location with an interactive Google Maps iframe or a fallback placeholder when the map URL is unavailable. It includes an info box overlay showing the address and distance to sea.

## Features

- **Interactive Map**: Embeds Google Maps iframe with 400px height
- **Fallback UI**: Shows a static placeholder with ocean gradient when map URL is missing
- **Info Box**: Displays address and distance to sea with appropriate icons
- **Responsive Design**: Maintains proper aspect ratio across all devices
- **Ocean Theme**: Uses ocean-themed shadows, colors, and styling
- **Accessibility**: Includes proper ARIA labels and semantic HTML

## Props

```typescript
interface LocationMapProps {
  mapUrl?: string;          // Optional Google Maps embed URL
  address: string;          // Property address (required)
  locationName?: string;    // Optional location/area name
  distanceToSea?: string;   // Optional distance to sea (e.g., "50m", "1km")
}
```

## Usage

### With Map URL

```tsx
import { LocationMap } from '@/components/property/LocationMap';

<LocationMap
  mapUrl="https://www.google.com/maps/embed?pb=..."
  address="123 Beach Road, Vung Tau"
  locationName="Bãi Sau"
  distanceToSea="50m"
/>
```

### Without Map URL (Fallback)

```tsx
<LocationMap
  address="123 Beach Road, Vung Tau"
  locationName="Bãi Sau"
  distanceToSea="50m"
/>
```

## Design Specifications

### Map Section
- **Height**: 400px (fixed)
- **Border Radius**: 12px (rounded-xl)
- **Shadow**: shadow-warm-lg
- **Aspect Ratio**: Responsive, maintains proper ratio

### Info Box Overlay (when map present)
- **Position**: Absolute, bottom-left (bottom-4 left-4)
- **Background**: sand-gold-50 with backdrop blur
- **Padding**: 16px (p-4)
- **Shadow**: shadow-warm-md
- **Max Width**: max-w-md

### Fallback Placeholder (when no map)
- **Height**: 400px
- **Background**: Gradient from ocean-blue-100 to teal-water-100
- **Icon**: MapPin, 64px size, ocean-blue-500 color
- **Message**: "Bản đồ không khả dụng"

### Icons
- **MapPin**: 20px size, ocean-blue-600 color
- **Waves**: 20px size, ocean-blue-600 color

## Styling

The component uses:
- Ocean theme CSS variables for colors
- Tailwind utility classes for layout and spacing
- shadow-warm-lg for card shadow
- Rounded corners (rounded-xl) for modern look

## Accessibility

- Iframe includes `title` attribute for screen readers
- Icons are decorative (aria-hidden implied)
- Semantic HTML structure
- Proper color contrast for text

## Requirements Validation

This component satisfies the following requirements:
- **2.5**: Conditional map embedding based on mapUrl
- **6.1**: Address display with MapPin icon
- **6.2**: Distance to sea display with Waves icon
- **6.3**: Interactive Google Maps iframe
- **6.4**: Ocean blue accent colors for consistency
- **6.5**: Responsive aspect ratio maintenance

## Related Components

- `PropertyHeader` - Displays property name and location
- `BookingWidget` - Also shows distance to sea
- `DescriptionCard` - Similar card styling pattern
