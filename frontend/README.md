# Frontend - Next.js Application

## Overview

Modern React application for TaiVillaVungTau villa rental platform with SSR support.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **React:** 19.2.0
- **Styling:** Tailwind CSS 4
- **State:** Zustand + React Query
- **Forms:** React Hook Form + Zod
- **i18n:** next-intl
- **Icons:** Lucide React
- **Components:** Radix UI

## Project Structure

```
app/
├── page.tsx              # Homepage
├── layout.tsx            # Root layout + metadata
├── globals.css           # Global styles
├── properties/
│   └── [id]/page.tsx     # Property detail page
├── contact/page.tsx      # Consultation form
├── login/page.tsx        # Admin login
└── admin/
    ├── layout.tsx        # Admin layout + sidebar
    ├── page.tsx          # Dashboard
    ├── properties/       # Property CRUD
    ├── requests/         # Consultation requests
    └── amenities/        # Amenities management

components/
├── ui/                   # Base components (Button, Card, Input...)
├── home/                 # Homepage sections
│   └── HomePageContent.tsx
├── property/             # Property components
│   ├── ImageGallery.tsx  # Photo gallery with modal
│   ├── PropertyHeader.tsx
│   ├── AmenitiesGrid.tsx
│   └── ...
├── admin/                # Admin components
│   ├── PropertyForm.tsx
│   ├── ImageUploader.tsx
│   └── NotificationBell.tsx
├── shared/               # Shared components
├── navbar.tsx
├── footer.tsx
└── floating-contact.tsx

lib/
├── api.ts                # Axios instance with interceptors
├── notifications.ts      # Toast notifications
└── utils.ts              # Helper functions

stores/
├── useAuthStore.ts       # Auth state + JWT management
├── useNotificationStore.ts # Real-time notifications
└── useFilterStore.ts     # Search filters
```

## Key Features

### 1. Server-Side Rendering (SSR)

- Homepage fetches properties on server
- SEO-optimized with proper meta tags
- Fast initial page loads

### 2. State Management

| Store             | Purpose              | Persistence  |
| ----------------- | -------------------- | ------------ |
| AuthStore         | User session, tokens | localStorage |
| NotificationStore | Real-time alerts     | localStorage |
| FilterStore       | Search filters       | None         |

### 3. Real-time WebSocket

```typescript
// Connects to /ws/websocket
// Subscribes to /topic/requests
// Updates NotificationStore on new requests
```

### 4. Image Optimization

- Cloudinary CDN for villa images
- WebP/AVIF format support
- Blur placeholder during loading
- Responsive srcset

### 5. Internationalization

- Vietnamese (default)
- English (prepared)
- Translation files: `/messages/vi.json`, `/messages/en.json`

## Running Locally

```bash
# Prerequisites: Node.js 18+

# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build
npm start
```

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Design System

- **Theme:** Coastal Luxury (Ocean blue gradient)
- **Typography:** Lora (headings), Inter (body)
- **Colors:**
  - Primary: `#0c4a6e` (deep blue)
  - Accent: `#0891b2` (cyan)
  - Background: gradients with white/slate

## Key Skills Demonstrated

- ✅ React Server Components
- ✅ TypeScript strict mode
- ✅ Modern CSS with Tailwind
- ✅ Complex form handling
- ✅ Global state management
- ✅ API integration with caching
- ✅ WebSocket real-time features
- ✅ Responsive design
- ✅ Accessibility (WCAG)
- ✅ Performance optimization
