# Tropical Component Variants

This document describes the tropical-themed variants added to shadcn/ui components for the Taivillavungtau brand redesign.

## Requirements Coverage

- **Requirement 6.1**: Card component with warm shadow utilities
- **Requirement 6.2**: Button component with tropical gradient variants
- **Requirement 6.3**: Badge component with tropical color variants
- **Requirement 6.4**: Tropical loading components using shadcn Skeleton

## Button Component

### New Variants

#### `sunset` - Tropical Sunset Gradient
```tsx
<Button variant="sunset">Book Now</Button>
```
- Background: Orange to yellow gradient
- Text: White
- Shadow: Warm orange-tinted shadow
- Hover: Scales up with enhanced shadow
- Ripple: Orange-tinted ripple effect

#### `ocean` - Ocean Breeze Gradient
```tsx
<Button variant="ocean">Learn More</Button>
```
- Background: Cyan to turquoise gradient
- Text: White
- Shadow: Warm shadow
- Hover: Scales up with enhanced shadow
- Ripple: Cyan-tinted ripple effect

### Usage Example
```tsx
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <div className="flex gap-4">
      <Button variant="sunset" size="lg">
        Đặt Villa Ngay
      </Button>
      <Button variant="ocean" size="lg">
        Xem Thêm
      </Button>
    </div>
  );
}
```

## Card Component

### New Shadow Variants

#### `warm` - Warm Orange-Tinted Shadow
```tsx
<Card shadow="warm">
  <CardContent>Content</CardContent>
</Card>
```
- Shadow: Medium warm shadow with orange tint
- Hover: Enhanced warm shadow

#### `warm-lg` - Large Warm Shadow
```tsx
<Card shadow="warm-lg">
  <CardContent>Content</CardContent>
</Card>
```
- Shadow: Large warm shadow with orange tint
- Hover: Extra large warm shadow

#### `none` - No Shadow
```tsx
<Card shadow="none">
  <CardContent>Content</CardContent>
</Card>
```

### Usage Example
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function PropertyCard() {
  return (
    <Card shadow="warm" className="hover-lift">
      <CardHeader>
        <CardTitle>Villa Ocean View</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Beautiful villa with ocean view...</p>
      </CardContent>
    </Card>
  );
}
```

## Badge Component

### New Tropical Variants

#### `coral` - Coral Orange
```tsx
<Badge variant="coral">MS:226</Badge>
```
- Background: Tropical orange (#FF6B35)
- Text: White

#### `turquoise` - Turquoise Cyan
```tsx
<Badge variant="turquoise">Bãi Sau</Badge>
```
- Background: Tropical cyan (#00BCD4)
- Text: White

#### `sunset` - Sunset Gradient
```tsx
<Badge variant="sunset">Featured</Badge>
```
- Background: Orange to yellow gradient
- Text: White
- Shadow: Warm shadow

#### `ocean` - Ocean Gradient
```tsx
<Badge variant="ocean">New</Badge>
```
- Background: Cyan to turquoise gradient
- Text: White
- Shadow: Warm shadow

#### `yellow` - Tropical Yellow
```tsx
<Badge variant="yellow">Hot Deal</Badge>
```
- Background: Tropical yellow (#FDB813)
- Text: Warm gray

### Usage Example
```tsx
import { Badge } from '@/components/ui/badge';

export function VillaInfo() {
  return (
    <div className="flex gap-2">
      <Badge variant="coral">MS:226</Badge>
      <Badge variant="turquoise">100m to beach</Badge>
      <Badge variant="sunset">Featured</Badge>
    </div>
  );
}
```

## Skeleton Component

### New Variants

#### `tropical` - Tropical Gradient Skeleton
```tsx
<Skeleton variant="tropical" className="h-10 w-full" />
```
- Background: Gradient from orange to yellow to cyan
- Animation: Pulse

#### `warm` - Warm Gray Skeleton
```tsx
<Skeleton variant="warm" className="h-10 w-full" />
```
- Background: Warm gray
- Animation: Pulse

### New Loading Components

#### `TropicalSpinner` - Dual-Ring Spinner
```tsx
import { TropicalSpinner } from '@/components/ui/skeleton';

<TropicalSpinner />
```
- Outer ring: Orange gradient
- Inner ring: Cyan gradient (reverse rotation)
- Animation: Continuous spin

#### `TropicalLoadingDots` - Three-Dot Loader
```tsx
import { TropicalLoadingDots } from '@/components/ui/skeleton';

<TropicalLoadingDots />
```
- Three dots: Orange, yellow, cyan
- Animation: Bounce with staggered delay

### Usage Example
```tsx
import { Skeleton, TropicalSpinner, TropicalLoadingDots } from '@/components/ui/skeleton';

export function LoadingProperty() {
  return (
    <div className="space-y-4">
      <Skeleton variant="tropical" className="h-48 w-full" />
      <Skeleton variant="warm" className="h-6 w-3/4" />
      <Skeleton variant="warm" className="h-4 w-1/2" />
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <TropicalSpinner />
      <p className="mt-4">Đang tải...</p>
    </div>
  );
}
```

## LoadingState Component Updates

The `LoadingState` component has been updated to use tropical styling:

### `LoadingSpinner` - Now supports tropical variant
```tsx
import { LoadingSpinner } from '@/components/shared/LoadingState';

<LoadingSpinner variant="tropical" size="lg" />
```

### `PropertyCardSkeleton` - Uses tropical gradients
```tsx
import { PropertyCardSkeleton } from '@/components/shared/LoadingState';

<PropertyCardSkeleton count={6} />
```
- Image placeholder: Tropical gradient
- Text placeholders: Warm gray
- Shadow: Warm shadow

### `ProgressBar` - Uses sunset gradient
```tsx
import { ProgressBar } from '@/components/shared/LoadingState';

<ProgressBar progress={75} />
```
- Background: Warm gray
- Progress bar: Sunset gradient

### `PageLoading` - Uses tropical spinner
```tsx
import { PageLoading } from '@/components/shared/LoadingState';

<PageLoading message="Đang tải villa..." />
```

## Hover Effects

All tropical components support additional hover effects from globals.css:

### `hover-glow-orange` - Orange Glow on Hover
```tsx
<Button variant="sunset" className="hover-glow-orange">
  Hover Me
</Button>
```

### `hover-glow-cyan` - Cyan Glow on Hover
```tsx
<Button variant="ocean" className="hover-glow-cyan">
  Hover Me
</Button>
```

### `hover-lift` - Lift Effect on Hover
```tsx
<Card shadow="warm" className="hover-lift">
  <CardContent>Hover to lift</CardContent>
</Card>
```

## Demo Component

A complete demo of all tropical variants is available:

```tsx
import { TropicalVariantsDemo } from '@/components/ui/tropical-variants-demo';

// Use in a page to see all variants
<TropicalVariantsDemo />
```

## Color Reference

All tropical colors are defined in `globals.css`:

- **Orange**: `--tropical-orange-500` (#FF6B35)
- **Orange Dark**: `--tropical-orange-600` (#F7931E)
- **Cyan**: `--tropical-cyan-500` (#00BCD4)
- **Cyan Light**: `--tropical-cyan-300` (#4DD0E1)
- **Yellow**: `--tropical-yellow-500` (#FDB813)
- **Warm Gray**: `--warm-gray-*` (50-900)

## Gradients

Predefined gradients available:

- `bg-gradient-sunset`: Orange → Yellow gradient
- `bg-gradient-ocean`: Cyan → Turquoise gradient
- `text-gradient-sunset`: Text gradient (orange → yellow)
- `text-gradient-ocean`: Text gradient (cyan → turquoise)

## Shadows

Warm shadows with orange tint:

- `shadow-warm-sm`: Small warm shadow
- `shadow-warm-md`: Medium warm shadow
- `shadow-warm-lg`: Large warm shadow
- `shadow-warm-xl`: Extra large warm shadow
- `shadow-warm-2xl`: 2X large warm shadow

## Best Practices

1. **Use sunset variant for primary CTAs**: The sunset gradient is the most prominent and should be used for main call-to-action buttons.

2. **Use ocean variant for secondary actions**: The ocean gradient provides a nice contrast and works well for secondary buttons.

3. **Apply warm shadows to cards**: Use `shadow="warm"` or `shadow="warm-lg"` on cards to maintain brand consistency.

4. **Use tropical badges for important info**: Villa codes, distances, and featured tags should use tropical badge variants.

5. **Use tropical loading components**: Always use `TropicalSpinner` or `TropicalLoadingDots` for loading states to maintain brand consistency.

6. **Combine with hover effects**: Add `hover-glow-orange` or `hover-glow-cyan` classes to enhance interactivity.

## Migration Guide

If you have existing components using default shadcn variants, here's how to migrate:

### Before
```tsx
<Button variant="default">Click Me</Button>
<Card>Content</Card>
<Badge>Label</Badge>
```

### After (Tropical)
```tsx
<Button variant="sunset">Click Me</Button>
<Card shadow="warm">Content</Card>
<Badge variant="coral">Label</Badge>
```

## Notes

- All tropical variants are fully compatible with existing shadcn/ui components
- TypeScript types are properly defined for all new variants
- All components maintain accessibility standards
- Responsive design is preserved across all variants
