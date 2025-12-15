# BookingWidget Component

Enhanced sticky sidebar component for displaying pricing information and booking actions on property detail pages.

## Features

- ✅ Sticky positioning (top: 80px) for persistent visibility
- ✅ Integrates PriceDisplay component with 'detailed' variant
- ✅ Conditional price notes in yellow alert box
- ✅ Distance to sea display with Waves icon
- ✅ Primary CTA button with ocean gradient and glow effect
- ✅ Conditional secondary Facebook button
- ✅ Trust indicators with green checkmarks
- ✅ Ocean-themed shadows and borders
- ✅ Fully responsive design

## Requirements Validation

This component validates the following requirements:
- **3.1**: Sticky positioning that remains visible while scrolling
- **3.2**: Displays weekday and weekend pricing with clear visual distinction (via PriceDisplay)
- **3.3**: Conditional price notes in highlighted yellow alert box
- **3.4**: "Request Consultation" button navigates to contact page with property code
- **3.5**: Conditional Facebook link button
- **7.1**: Trust indicators with green checkmarks
- **7.2**: Distance to sea display with wave icon

## Props

```typescript
interface BookingWidgetProps {
  weekdayPrice: number;        // Required: Weekday price in VND
  weekendPrice?: number;       // Optional: Weekend price in VND
  priceNote?: string;          // Optional: Special pricing notes
  distanceToSea?: string;      // Optional: Distance to sea (e.g., "100m")
  facebookLink?: string;       // Optional: Facebook page URL
  propertyCode: string;        // Required: Property code for consultation
  standardGuests: number;      // Required: Standard guest count
  bedroomCount: number;        // Required: Number of bedrooms
}
```

## Usage

### Basic Usage

```tsx
import { BookingWidget } from '@/components/property/BookingWidget';

<BookingWidget
  weekdayPrice={2500000}
  weekendPrice={3000000}
  propertyCode="MS208"
  standardGuests={15}
  bedroomCount={4}
/>
```

### With All Optional Props

```tsx
<BookingWidget
  weekdayPrice={2500000}
  weekendPrice={3000000}
  priceNote="Giá có thể thay đổi vào dịp lễ Tết"
  distanceToSea="100m"
  facebookLink="https://facebook.com/villa-ms208"
  propertyCode="MS208"
  standardGuests={15}
  bedroomCount={4}
/>
```

### In Property Detail Page

```tsx
import { BookingWidget } from '@/components/property/BookingWidget';

export default function PropertyDetailPage() {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1">
        {/* Property details */}
      </div>

      {/* Sidebar */}
      <aside className="lg:w-96 shrink-0">
        <BookingWidget
          weekdayPrice={property.priceWeekday}
          weekendPrice={property.priceWeekend}
          priceNote={property.priceNote}
          distanceToSea={property.distanceToSea}
          facebookLink={property.facebookLink}
          propertyCode={property.code}
          standardGuests={property.standardGuests}
          bedroomCount={property.bedroomCount}
        />
      </aside>
    </div>
  );
}
```

## Component Structure

### 1. Price Display Section
- Uses the existing `PriceDisplay` component with 'detailed' variant
- Shows weekday and weekend pricing with badges
- Includes seasonal and holiday disclaimers

### 2. Price Notes Alert (Conditional)
- Only renders if `priceNote` prop is provided
- Uses yellow Alert component for visibility
- Styled with tropical yellow colors

### 3. Distance to Sea (Conditional)
- Only renders if `distanceToSea` prop is provided
- Displays with Waves icon in ocean blue color
- Compact, single-line format

### 4. Primary CTA Button
- "Yêu Cầu Tư Vấn" (Request Consultation)
- Links to contact page with property code as query parameter
- Ocean gradient background with glow effect on hover
- Full width, large size

### 5. Secondary Facebook Button (Conditional)
- Only renders if `facebookLink` prop is provided
- Opens in new tab with security attributes
- Outline style with ocean blue colors
- Facebook icon included

### 6. Trust Indicators
- Two indicators with green checkmarks:
  - "Miễn phí hủy trong 24h" (Free cancellation within 24h)
  - "Hỗ trợ 24/7" (24/7 Support)
- Separated by top border
- Consistent spacing and alignment

## Styling

### Ocean Theme
- **Shadow**: `shadow-warm-xl` with custom ocean blue tint
- **Border**: `border-[var(--ocean-blue-100)]`
- **Rounded**: `rounded-2xl` for modern look
- **Padding**: `p-8` for spacious feel

### Sticky Positioning
- **Position**: `sticky top-20` (80px from top)
- **Width**: `w-full lg:w-96` (384px on desktop)
- **Background**: White with ocean-themed shadow

### Button Styles
- **Primary**: Ocean gradient with glow effect
- **Secondary**: Outline with ocean blue border
- **Hover**: Scale and shadow transitions

### Colors
- Ocean Blue: `var(--ocean-blue-600)`, `var(--ocean-blue-100)`
- Tropical Yellow: `var(--tropical-yellow-900)`, `var(--tropical-yellow-800)`
- Green: `text-green-500` for trust indicators

## Responsive Behavior

### Desktop (1024px+)
- Fixed width of 384px
- Sticky positioning at top: 80px
- Displays as sidebar

### Tablet (640px-1023px)
- Full width
- Sticky positioning maintained
- Stacks below content

### Mobile (<640px)
- Full width
- May convert to fixed bottom bar (implementation dependent)
- All features remain accessible

## Accessibility

- Semantic HTML structure
- Clear button labels
- External links have proper `rel` attributes
- Color contrast meets WCAG AA standards
- Keyboard navigable
- Screen reader friendly

## Related Components

- `PriceDisplay` - Displays pricing information
- `Button` - Shadcn UI Button with ocean variants
- `Alert` - Shadcn UI Alert with warning variant
- `Waves`, `CheckCircle`, `Facebook` - Lucide React icons

## Navigation

The primary CTA button navigates to `/contact?propertyCode={code}`, which:
1. Opens the contact form page
2. Pre-fills the property code field
3. Allows users to submit consultation requests

## Notes

- All optional props are conditionally rendered
- Component maintains ocean theme consistency
- Sticky behavior works on scroll
- Trust indicators are hardcoded (not dynamic)
- Facebook button opens in new tab for security

## Testing

See `BookingWidget.example.tsx` for visual examples and test cases.
