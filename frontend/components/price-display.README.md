# PriceDisplay Component

A reusable component for displaying villa pricing with tropical styling, following the Facebook fanpage format.

## Features

- ✅ Displays weekday and weekend prices in Vietnamese format
- ✅ Shows guest count and optional room count
- ✅ Includes price labels (weekday/weekend)
- ✅ Displays seasonal and holiday disclaimers
- ✅ Tropical gradient text styling
- ✅ Three variants: default, compact, and detailed
- ✅ Fully responsive design

## Requirements Validation

This component validates the following requirements:
- **12.1**: Display weekday price with format "X.XXX.XXXđ/Y khách/đêm"
- **12.2**: Add "Giá ngày thường" or "Thứ 2 - Thứ 5" label
- **12.3**: Display weekend price with "Giá Thứ 6, Thứ 7, Chủ nhật" label
- **12.4**: Add seasonal disclaimer
- **12.5**: Add holiday disclaimer about Lễ, Tết pricing

## Props

```typescript
interface PriceDisplayProps {
  weekdayPrice: number;        // Required: Weekday price in VND
  weekendPrice?: number;       // Optional: Weekend price in VND
  guestCount: number;          // Required: Number of guests
  roomCount?: number;          // Optional: Number of rooms
  variant?: 'default' | 'compact' | 'detailed';  // Default: 'default'
  className?: string;          // Optional: Additional CSS classes
}
```

## Variants

### Default
Shows weekday price with badge, and weekend price if provided. No disclaimers.

```tsx
<PriceDisplay
  weekdayPrice={2500000}
  weekendPrice={3000000}
  guestCount={15}
  roomCount={4}
  variant="default"
/>
```

### Compact
Minimal display with just weekday price and badge. Perfect for cards or tight spaces.

```tsx
<PriceDisplay
  weekdayPrice={2500000}
  guestCount={15}
  variant="compact"
/>
```

### Detailed
Full display with weekday price, weekend price, and both disclaimers. Best for detail pages.

```tsx
<PriceDisplay
  weekdayPrice={2500000}
  weekendPrice={3000000}
  guestCount={15}
  roomCount={4}
  variant="detailed"
/>
```

## Usage Examples

### In Property Card

```tsx
import { PriceDisplay } from '@/components/price-display';

<PriceDisplay
  weekdayPrice={property.priceWeekday}
  weekendPrice={property.priceWeekend}
  guestCount={property.standardGuests}
  roomCount={property.bedroomCount}
  variant="detailed"
/>
```

### In Property Detail Page

```tsx
import { PriceDisplay } from '@/components/price-display';

<PriceDisplay
  weekdayPrice={property.priceWeekday}
  weekendPrice={property.priceWeekend}
  guestCount={property.standardGuests}
  roomCount={property.bedroomCount}
  variant="detailed"
  className="mb-6"
/>
```

### Compact Display in List

```tsx
<PriceDisplay
  weekdayPrice={property.priceWeekday}
  guestCount={property.standardGuests}
  variant="compact"
/>
```

## Price Formatting

The component uses the `formatVillaPrice` utility function from `lib/utils.ts`:

```typescript
formatVillaPrice(2500000, 15, 4)
// Output: "2,500.000đ/15 khách/4 phòng/đêm"

formatVillaPrice(2500000, 15)
// Output: "2,500.000đ/15 khách/đêm"
```

## Price Disclaimers

The component includes two hardcoded disclaimers (shown in detailed variant):

1. **Seasonal**: "Giá tại thời điểm đăng bài, có thay đổi theo mùa"
2. **Holiday**: "Giá các ngày Lễ, Tết có thay đổi"

These are defined in `lib/utils.ts` as `PRICE_DISCLAIMERS`.

## Styling

The component uses:
- Tropical gradient text for prices (`text-gradient-sunset`)
- Warm gradient background (`bg-gradient-warm-glow`)
- Tropical color badges (coral, yellow)
- Shadcn Card and Badge components
- CSS variables for tropical colors

## Accessibility

- Semantic HTML structure
- Clear price labels
- Readable font sizes
- High contrast text
- Screen reader friendly

## Related Components

- `Card` - Shadcn UI Card component
- `Badge` - Shadcn UI Badge component with tropical variants
- `property-card.tsx` - Uses PriceDisplay component
- `app/properties/[id]/page.tsx` - Uses PriceDisplay component

## Related Utilities

- `formatVillaPrice()` - Formats price according to Facebook style
- `PRICE_DISCLAIMERS` - Price disclaimer constants
- `formatPrice()` - General Vietnamese currency formatter

## Testing

See `price-display.example.tsx` for visual examples and test cases.

## Notes

- Prices are always in VND (Vietnamese Dong)
- Format follows Facebook fanpage style
- Weekend price is optional
- Room count is optional
- Disclaimers only show in detailed variant
