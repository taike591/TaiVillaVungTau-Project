# 🏖️ TaiVillaVungTau - Villa Catalog Platform

> **Live Site:** [taivillavungtau.vn](https://taivillavungtau.vn)
>
> A production villa catalog website replacing Facebook fanpage for easier property browsing. Built with Spring Boot and Next.js.

---

## 📌 Project Overview

**TaiVillaVungTau** is a **production website** that serves as a villa catalog, replacing the traditional Facebook fanpage approach. Instead of customers scrolling through hundreds of Facebook posts, they can use advanced search filters to find properties quickly.

### How It Works

```
Customer visits website → Browse/Filter 200+ villas → Contact via Zalo/Fanpage → Broker handles booking with villa owner
```

### Key Features

| Feature                       | Description                                             |
| ----------------------------- | ------------------------------------------------------- |
| 🏠 **Villa Catalog**          | Browse 200+ villas with photos, amenities, pricing info |
| 🔍 **Advanced Search**        | Filter by location, price, capacity, amenities, labels  |
| 📱 **Responsive Design**      | Mobile-first, optimized for all devices                 |
| 💬 **Consultation Requests**  | Contact form for customer inquiries                     |
| 🔐 **Admin Dashboard**        | Full CRUD for properties, requests, amenities           |
| � **Real-time Notifications** | Telegram alerts for new customer requests               |
| 🚀 **CI/CD Pipeline**         | Automated deployment via GitHub Actions                 |
| 📊 **Production Logging**     | Request ID tracing for easy debugging                   |

---

## �️ Tech Stack

### Backend (Spring Boot 3.4)

```
├── Framework:     Spring Boot 3.4.x
├── Language:      Java 17 (LTS)
├── Database:      MySQL 8.0
├── Cache:         Redis
├── ORM:           Spring Data JPA + Hibernate
├── Migrations:    Flyway
├── Security:      Spring Security 6 + JWT + Rate Limiting
├── Media:         Cloudinary CDN
├── Logging:       Logback with Request ID tracing
└── API Docs:      Springdoc OpenAPI (Swagger)
```

### Frontend (Next.js 15)

```
├── Framework:     Next.js 15 (App Router)
├── Language:      TypeScript 5
├── Styling:       Tailwind CSS
├── State:         Zustand + React Query
├── Forms:         React Hook Form + Zod
├── Deployment:    Vercel
└── SEO:           SSR + Meta tags optimization
```

### DevOps & Infrastructure

```
├── Containerization:  Docker + Docker Compose
├── CI/CD:             GitHub Actions (auto deploy on push)
├── Cloud:             Google Cloud Platform (GCP VM)
├── CDN/Security:      Cloudflare (SSL, DDoS protection)
├── Monitoring:        Spring Boot Actuator
└── Domain:            taivillavungtau.vn
```

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   Cloudflare    │     │     Vercel      │
│  (DNS + CDN)    │     │   (Frontend)    │
└────────┬────────┘     └────────┬────────┘
         │                       │
         ▼                       ▼
┌─────────────────────────────────────────────────────┐
│                  GCP VM Server                       │
│  ┌─────────────────────────────────────────────┐   │
│  │              Nginx (Reverse Proxy)           │   │
│  └─────────────────────────────────────────────┘   │
│                        │                            │
│  ┌─────────────────────▼─────────────────────┐     │
│  │         Spring Boot Backend (:8080)        │     │
│  │  • REST APIs      • JWT Auth               │     │
│  │  • Rate Limiting  • Request ID Logging     │     │
│  └─────────────────────┬─────────────────────┘     │
│           ┌────────────┴────────────┐              │
│           ▼                         ▼              │
│  ┌─────────────────┐     ┌─────────────────┐      │
│  │  MySQL (:3306)  │     │  Redis (:6379)  │      │
│  └─────────────────┘     └─────────────────┘      │
└─────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
TaiVillaVungTau/
├── backend/                  # Spring Boot Application
│   ├── src/main/java/
│   │   └── com/taivillavungtau/backend/
│   │       ├── controller/   # REST Controllers
│   │       ├── service/      # Business Logic
│   │       ├── repository/   # Data Access (JPA)
│   │       ├── entity/       # Database Entities
│   │       ├── dto/          # Data Transfer Objects
│   │       ├── config/       # App Configuration
│   │       ├── security/     # JWT & Auth
│   │       ├── filter/       # Request ID Filter, Rate Limiting
│   │       └── exception/    # Global Error Handling
│   ├── src/main/resources/
│   │   ├── db/migration/     # Flyway migrations
│   │   └── logback-spring.xml # Logging config
│   └── Dockerfile
│
├── frontend/                 # Next.js Application
│   ├── app/                  # App Router pages
│   ├── components/           # React components
│   ├── lib/                  # API client & utilities
│   └── stores/               # Zustand state
│
├── .github/workflows/        # CI/CD Pipelines
│   └── docker-build.yml      # Auto deploy on push
│
├── docker-compose.yml        # Production deployment
└── README.md
```

---

## 🔑 Key Implementation Details

### 1. Production Logging with Request ID

Every request gets a unique ID for easy tracing:

```
2024-12-24 10:30:15 [abc12345] INFO PropertyService - Fetching property
2024-12-24 10:30:15 [abc12345] ERROR GlobalException - Error occurred
```

Use `grep "abc12345" logs/app.log` to trace entire request flow.

### 2. CI/CD Pipeline

```yaml
Push to main → Run Tests → Build Docker Image → Deploy to GCP
```

- Automated on every push to `main` branch
- Fresh Docker builds (no cache) for reliability
- Zero-downtime deployment

### 3. Security Measures

| Feature              | Implementation                              |
| -------------------- | ------------------------------------------- |
| **Authentication**   | JWT with access (1h) + refresh tokens (30d) |
| **Rate Limiting**    | 60 requests/minute per IP                   |
| **DDoS Protection**  | Cloudflare                                  |
| **SSL/HTTPS**        | Cloudflare Full (strict)                    |
| **Password Hashing** | BCrypt (strength 12)                        |

### 4. Advanced Search (JPA Specification)

Dynamic query building for flexible filtering:

```java
Specification<Property> spec = Specification
    .where(hasKeyword(keyword))
    .and(hasLocation(locationId))
    .and(priceBetween(minPrice, maxPrice))
    .and(hasAmenities(amenityIds));
```

---

## 🎓 Skills Demonstrated

### Backend

- ✅ Java 17 + Spring Boot 3.x
- ✅ RESTful API design
- ✅ JWT authentication & authorization
- ✅ JPA Specification pattern (dynamic queries)
- ✅ Database migrations (Flyway)
- ✅ Production logging (Request ID tracing)
- ✅ Rate limiting & security

### DevOps

- ✅ Docker containerization
- ✅ GitHub Actions CI/CD
- ✅ GCP + Cloudflare infrastructure
- ✅ Nginx reverse proxy

### Frontend (AI-assisted)

- ✅ Next.js 15 with SSR for SEO
- ✅ TypeScript + Tailwind CSS
- ✅ React Query for data fetching

---

## 📝 License

This project is for portfolio demonstration purposes.

---

## 👤 Author

**Tai** - Backend Developer

- Website: [taivillavungtau.vn](https://taivillavungtau.vn)
- GitHub: [@taike591](https://github.com/taike591)
