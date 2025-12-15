# DescriptionCard Component

## Overview

The `DescriptionCard` component displays property descriptions with proper formatting and an optional bed configuration highlight box. It follows the ocean theme design system with proper typography, spacing, and color usage.

## Features

- **Preserved Line Breaks**: Uses `whitespace-pre-wrap` to maintain line breaks in descriptions
- **Ocean Theme Styling**: Section title uses ocean blue color (`--ocean-blue-600`)
- **Bed Configuration Highlight**: Optional sand-gold colored box for bed configuration
- **Typography**: Uses Inter font with 1.7 line height for optimal readability
- **Shadow**: Applies `shadow-warm-md` for consistent card elevation
- **Responsive**: Adapts to different screen sizes with proper padding

## Props

```typescript
interface DescriptionCardProps {
  description: string;    // Property description text (required)
  bedConfig?: string;     // Optional bed configuration (e.g., "3 giường đôi - 2 giường đơn")
}
```

## Usage

### Basic Usage

```tsx
import { DescriptionCard } from '@/components/property/DescriptionCard';

<DescriptionCard
  description="Villa sang trọng với view biển tuyệt đẹp."
/>
```

### With Bed Configuration

```tsx
<DescriptionCard
  description={`Villa sang trọng với view biển tuyệt đẹp.
Phòng khách rộng rãi, bếp hiện đại đầy đủ tiện nghi.`}
  bedConfig="3 giường đôi - 2 giường đơn"
/>
```

### Multi-line Description

```tsx
<DescriptionCard
  description={`Villa Ocean View là một trong những căn villa đẹp nhất.

Với thiết kế hiện đại, sang trọng, villa có view nhìn ra biển.
Phòng khách rộng rãi với sofa êm ái, TV màn hình lớn.

Khu vực ngoài trời có hồ bơi riêng và khu BBQ.`}
  bedConfig="4 giường đôi king size - 2 giường đơn"
/>
```

## Integration with Property Detail Page

Replace the existing description section in `app/properties/[id]/page.tsx`:

```tsx
// Before (old implementation)
<Card className="p-4 mb-4">
  <h2 className="text-xl font-bold mb-3">Mô tả</h2>
  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
    {property.description}
  </p>
  {property.bedConfig && (
    <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm">
      <div className="font-semibold text-blue-900 mb-1">Cấu hình giường:</div>
      <div className="text-blue-700">{property.bedConfig}</div>
    </div>
  )}
</Card>

// After (new implementation)
import { DescriptionCard } from '@/components/property/DescriptionCard';

<DescriptionCard
  description={property.description}
  bedConfig={property.bedConfig}
/>
```

## Design Specifications

### Colors
- **Section Title**: Ocean Blue 600 (`--ocean-blue-600`)
- **Description Text**: Navy Slate 700 (`--navy-slate-700`)
- **Bed Config Background**: Sand Gold 50 (`--sand-gold-50`)
- **Bed Config Border**: Sand Gold 200 (`--sand-gold-200`)
- **Bed Config Label**: Sand Gold 700 (`--sand-gold-700`)
- **Bed Config Text**: Sand Gold 900 (`--sand-gold-900`)

### Typography
- **Section Title**: 24px (text-2xl), semibold
- **Description**: 16px (text-base), line-height 1.7, Inter font
- **Bed Config Label**: 14px (text-sm), semibold
- **Bed Config Text**: 16px (text-base)

### Spacing
- **Card Padding**: 32px (p-8)
- **Title Margin Bottom**: 16px (mb-4)
- **Description Margin Bottom**: 16px (mb-4)
- **Bed Config Margin Top**: 16px (mt-4)
- **Bed Config Padding**: 16px (p-4)

### Visual Effects
- **Card Shadow**: shadow-warm-md (ocean-themed shadow)
- **Border Radius**: 12px (rounded-xl) for card, 8px (rounded-lg) for bed config box
- **Border**: 1px solid sand-gold-200 for bed config box

## Requirements Validation

This component satisfies the following requirements from the design document:

- **Requirement 2.3**: Renders description with preserved line breaks and highlights bed configuration
- **Requirement 4.2**: Uses Inter font with appropriate line height (1.7) for body text
- **Requirement 4.3**: Section title uses ocean blue color and semibold weight

## Accessibility

- Semantic HTML structure with proper heading hierarchy
- Sufficient color contrast for all text elements
- Clear visual distinction between description and bed configuration
- Responsive design works on all screen sizes

## Examples

See `DescriptionCard.example.tsx` for comprehensive usage examples including:
- With bed configuration
- Without bed configuration
- Long multi-paragraph descriptions
- Short descriptions

## Related Components

- `PropertyHeader` - Displays property name, code, and location
- `SpecsCard` - Displays property specifications (bedrooms, bathrooms, guests)
- `AmenitiesGrid` - Displays property amenities
- `LocationMap` - Displays property location on map

## Notes

- The component uses CSS variables for colors to maintain consistency with the ocean theme
- Line breaks in the description are preserved using `whitespace-pre-wrap`
- The bed configuration box is conditionally rendered only when `bedConfig` prop is provided
- The component is marked as `'use client'` for potential future interactivity
