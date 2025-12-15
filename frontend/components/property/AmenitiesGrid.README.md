# AmenitiesGrid Component

## Overview

The `AmenitiesGrid` component displays property amenities in a visually appealing grid format with checkmark icons. It supports optional category grouping and includes hover effects for enhanced interactivity.

## Features

- **3-column grid layout** on desktop (2 columns on mobile)
- **Checkmark icons** in teal-water-500 color (20px size)
- **Category grouping** when amenities have category data
- **Hover effects** that change text and icon color to ocean-blue-600
- **Ocean theme styling** with shadow-warm-md card
- **Responsive design** that adapts to different screen sizes
- **Graceful handling** of empty amenities (returns null)

## Props

```typescript
interface AmenitiesGridProps {
  amenities: Amenity[];
}

interface Amenity {
  id: number;
  name: string;
  icon?: string;
  category?: string;
}
```

## Usage

### Basic Usage (No Categories)

```tsx
import { AmenitiesGrid } from '@/components/property/AmenitiesGrid';

const amenities = [
  { id: 1, name: 'WiFi miễn phí' },
  { id: 2, name: 'Điều hòa' },
  { id: 3, name: 'Bể bơi riêng' },
  { id: 4, name: 'Bãi đậu xe' },
  { id: 5, name: 'Nhà bếp đầy đủ' },
  { id: 6, name: 'TV màn hình phẳng' },
];

<AmenitiesGrid amenities={amenities} />
```

### With Categories

```tsx
const amenitiesWithCategories = [
  { id: 1, name: 'WiFi miễn phí', category: 'Công nghệ' },
  { id: 2, name: 'TV màn hình phẳng', category: 'Công nghệ' },
  { id: 3, name: 'Điều hòa', category: 'Tiện nghi' },
  { id: 4, name: 'Máy sưởi', category: 'Tiện nghi' },
  { id: 5, name: 'Bếp gas', category: 'Nhà bếp' },
  { id: 6, name: 'Tủ lạnh', category: 'Nhà bếp' },
];

<AmenitiesGrid amenities={amenitiesWithCategories} />
```

### Empty Amenities

```tsx
// Component returns null when amenities array is empty
<AmenitiesGrid amenities={[]} />
```

## Design Specifications

### Layout
- **Desktop (lg)**: 3-column grid
- **Tablet (md)**: 2-column grid
- **Mobile**: 1-column stack
- **Gap**: 16px between items
- **Card padding**: 32px

### Typography
- **Section title**: 24px, bold, navy-slate-900
- **Category headers**: 16px, semibold, ocean-blue-600
- **Amenity text**: 15px, navy-slate-700

### Colors
- **Checkmark icon**: teal-water-500 (default), ocean-blue-600 (hover)
- **Text**: navy-slate-700 (default), ocean-blue-600 (hover)
- **Card background**: White with shadow-warm-md
- **Category dividers**: navy-slate-200

### Interactive States
- **Hover**: Text and icon color change to ocean-blue-600
- **Transition**: 200ms duration for smooth color changes

## Accessibility

- Uses semantic HTML structure
- Checkmark icons have appropriate sizing for visibility
- Text maintains readable contrast ratios
- Hover states provide clear visual feedback

## Responsive Behavior

| Breakpoint | Grid Columns | Behavior |
|------------|--------------|----------|
| < 768px    | 1 column     | Stacked layout |
| 768px - 1023px | 2 columns | Tablet layout |
| ≥ 1024px   | 3 columns    | Desktop layout |

## Category Grouping Logic

The component automatically groups amenities by their `category` field:

1. If amenities have different categories, they are grouped and displayed with category headers
2. If all amenities have the same category or no category, they are displayed in a simple grid without headers
3. Categories are separated by horizontal dividers
4. Default category name is "Tiện nghi" (Amenities) if not specified

## Integration Example

```tsx
// In a property detail page
import { AmenitiesGrid } from '@/components/property/AmenitiesGrid';
import { useProperty } from '@/lib/hooks/useProperties';

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const { data: property, isLoading } = useProperty(params.id);
  
  if (isLoading) return <div>Loading...</div>;
  if (!property) return <div>Property not found</div>;
  
  return (
    <div className="space-y-8">
      {/* Other property sections */}
      
      <AmenitiesGrid amenities={property.amenities} />
      
      {/* More sections */}
    </div>
  );
}
```

## Requirements Validation

This component satisfies **Requirement 2.4**:
- ✅ Displays amenities in a visually appealing grid
- ✅ Uses checkmark icons (teal-water-500, 20px)
- ✅ Implements 3-column grid (2 columns on mobile)
- ✅ Groups by category when available
- ✅ Applies hover effects (color change to ocean-blue-600)
- ✅ Uses shadow-warm-md for card styling
