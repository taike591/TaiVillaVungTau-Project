# 🏖️ TaiVillaVungTau - Villa Rental Platform

> **Live Site:** [taivillavungtau.vn](https://taivillavungtau.vn)
>
> A full-stack villa rental web application for Vung Tau, Vietnam. Built with modern technologies and best practices.

---

## 📌 Project Overview

**TaiVillaVungTau** is a production-ready villa rental platform that allows users to browse, search, and request bookings for vacation villas in Vung Tau city. The platform includes both a customer-facing website and an admin management system.

### Key Features

| Feature                        | Description                                              |
| ------------------------------ | -------------------------------------------------------- |
| 🏠 **Villa Catalog**           | Browse 100+ villas with detailed info, photos, amenities |
| 🔍 **Advanced Search**         | Filter by location, price, capacity, amenities           |
| 📱 **Responsive Design**       | Mobile-first, works on all devices                       |
| 💬 **Consultation Requests**   | Form submission with real-time notifications             |
| 🔐 **Admin Dashboard**         | CRUD operations for properties, requests, amenities      |
| 🔔 **Real-time Notifications** | WebSocket-based notifications for new requests           |
| 🌐 **Internationalization**    | Vietnamese/English support (next-intl)                   |

---

## 🛠️ Tech Stack

### Frontend (Next.js 16)

```
├── Framework:     Next.js 16 (App Router)
├── Language:      TypeScript 5
├── UI Library:    React 19
├── Styling:       Tailwind CSS 4
├── State:         Zustand (global) + React Query (server)
├── Forms:         React Hook Form + Zod validation
├── i18n:          next-intl
├── Icons:         Lucide React
├── Components:    Radix UI primitives
└── Real-time:     WebSocket (STOMP.js)
```

### Backend (Spring Boot 3.4)

```
├── Framework:     Spring Boot 3.4.12
├── Language:      Java 17
├── Database:      MySQL 8.0
├── Cache:         Redis
├── ORM:           Spring Data JPA + Hibernate
├── Migrations:    Flyway
├── Security:      Spring Security + JWT
├── API Docs:      Springdoc OpenAPI (Swagger)
├── Media:         Cloudinary CDN
└── Mapping:       MapStruct
```

### DevOps & Infrastructure

```
├── Containerization:  Docker + Docker Compose
├── CI/CD:             GitHub Actions (planned)
├── Monitoring:        Spring Boot Actuator
├── Hosting:           VPS / Vercel + Railway
└── Domain:            taivillavungtau.vn
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client                               │
│  (Browser - React/Next.js)                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Server                            │
│  • Server Components (SSR)                                   │
│  • API Rewrites (/api/v1/* → Backend)                       │
│  • Static Assets + Image Optimization                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Spring Boot Backend                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │ Controllers │ │  Services   │ │Repositories │           │
│  │  (REST API) │ │  (Logic)    │ │   (JPA)     │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│         │              │               │                     │
│         ▼              ▼               ▼                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   Security  │ │   WebSocket │ │  Cloudinary │           │
│  │    (JWT)    │ │   (STOMP)   │ │   (Media)   │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────┐         ┌─────────────────────┐
│       MySQL         │         │        Redis        │
│   (Primary DB)      │         │   (Cache/Session)   │
└─────────────────────┘         └─────────────────────┘
```

---

## 📁 Project Structure

```
TaiVillaVungTau/
├── frontend/                 # Next.js Application
│   ├── app/                  # App Router pages
│   │   ├── page.tsx          # Homepage
│   │   ├── properties/       # Villa listing & details
│   │   ├── contact/          # Consultation form
│   │   ├── admin/            # Admin dashboard
│   │   └── login/            # Auth page
│   ├── components/           # React components
│   │   ├── ui/               # Base UI (Button, Card, etc.)
│   │   ├── home/             # Homepage sections
│   │   ├── property/         # Property detail components
│   │   ├── admin/            # Admin components
│   │   └── shared/           # Shared components
│   ├── lib/                  # Utilities & API client
│   ├── stores/               # Zustand state stores
│   └── messages/             # i18n translations
│
├── backend/                  # Spring Boot Application
│   ├── src/main/java/
│   │   └── com/taivillavungtau/backend/
│   │       ├── controller/   # REST Controllers
│   │       ├── service/      # Business Logic
│   │       ├── repository/   # Data Access
│   │       ├── entity/       # JPA Entities
│   │       ├── dto/          # Data Transfer Objects
│   │       ├── config/       # Configuration
│   │       ├── security/     # JWT & Auth
│   │       └── exception/    # Error Handling
│   ├── src/main/resources/
│   │   └── db/migration/     # Flyway migrations
│   ├── Dockerfile
│   └── docker-compose.yml
│
└── README.md                 # This file
```

---

## 🔑 Key Implementation Details

### 1. Authentication Flow (JWT)

```
Login Request → Validate Credentials → Generate JWT + Refresh Token
     ↓
Store in Zustand (persist to localStorage)
     ↓
Attach JWT to API requests via Axios interceptor
     ↓
Auto-refresh when token expires
```

### 2. Real-time Notifications (WebSocket)

```
New Consultation Request → Backend publishes to /topic/requests
     ↓
Admin clients subscribed via STOMP.js
     ↓
NotificationStore updates → Bell icon shows count
```

### 3. Image Optimization

- **Cloudinary CDN** for villa images
- **Next.js Image** with WebP/AVIF formats
- **Lazy loading** with blur placeholders
- **Responsive srcset** for all screen sizes

### 4. State Management

| Store                  | Purpose                                |
| ---------------------- | -------------------------------------- |
| `useAuthStore`         | User session, JWT tokens               |
| `useNotificationStore` | Real-time notifications                |
| `useFilterStore`       | Search filters (location, price, etc.) |

### 5. API Design (RESTful)

```
GET    /api/v1/properties          # List with pagination + filters
GET    /api/v1/properties/{id}     # Detail
POST   /api/v1/properties          # Create (Admin)
PUT    /api/v1/properties/{id}     # Update (Admin)
DELETE /api/v1/properties/{id}     # Delete (Admin)

POST   /api/v1/requests            # Submit consultation
GET    /api/v1/requests            # List requests (Admin)
PATCH  /api/v1/requests/{id}/status # Update status (Admin)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Java 17+
- MySQL 8.0
- Redis (optional for local dev)

### Development Setup

```bash
# Clone repository
git clone https://github.com/your-username/TaiVillaVungTau.git
cd TaiVillaVungTau

# Backend
cd backend
cp src/main/resources/application.properties.example src/main/resources/application.properties
# Edit application.properties with your DB credentials
mvn spring-boot:run

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### Production Deployment

```bash
# Backend with Docker
cd backend
docker-compose up -d

# Frontend
cd frontend
npm run build
npm start
# Or deploy to Vercel
```

---

## 🎓 Skills Demonstrated

This project showcases proficiency in:

### Frontend

- ✅ React 19 with Server Components
- ✅ TypeScript strict mode
- ✅ Modern CSS (Tailwind, CSS-in-JS patterns)
- ✅ State management (Zustand + React Query)
- ✅ Form handling with validation
- ✅ Responsive & accessible design
- ✅ Performance optimization (lazy loading, code splitting)
- ✅ Internationalization (i18n)

### Backend

- ✅ Spring Boot 3.x with Java 17
- ✅ RESTful API design
- ✅ JWT authentication & authorization
- ✅ Database design with JPA/Hibernate
- ✅ Database migrations (Flyway)
- ✅ Caching strategies (Redis)
- ✅ WebSocket real-time communication
- ✅ Cloud media management (Cloudinary)
- ✅ API documentation (OpenAPI/Swagger)

### DevOps

- ✅ Docker containerization
- ✅ Multi-stage builds
- ✅ Environment configuration
- ✅ Health checks (Actuator)

---

## 📝 License

This project is for portfolio demonstration purposes.

---

## 👤 Author

**Tai** - Full Stack Developer

- Website: [taivillavungtau.vn](https://taivillavungtau.vn)
- GitHub: [@your-github](https://github.com/your-github)
