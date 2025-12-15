# Backend - Spring Boot API

## Overview

RESTful API server for TaiVillaVungTau villa rental platform.

## Tech Stack

- **Framework:** Spring Boot 3.4.12
- **Java:** 17 (LTS)
- **Database:** MySQL 8.0
- **Cache:** Redis
- **Security:** Spring Security + JWT
- **Migrations:** Flyway
- **API Docs:** Springdoc OpenAPI (Swagger)
- **Media:** Cloudinary CDN

## API Endpoints

### Public Endpoints

| Method | Endpoint                  | Description                     |
| ------ | ------------------------- | ------------------------------- |
| GET    | `/api/v1/properties`      | List properties with pagination |
| GET    | `/api/v1/properties/{id}` | Get property details            |
| GET    | `/api/v1/locations`       | List all locations              |
| GET    | `/api/v1/amenities`       | List all amenities              |
| POST   | `/api/v1/requests`        | Submit consultation request     |
| POST   | `/api/v1/auth/login`      | User login                      |
| POST   | `/api/v1/auth/refresh`    | Refresh JWT token               |

### Admin Endpoints (Protected)

| Method | Endpoint                       | Description                 |
| ------ | ------------------------------ | --------------------------- |
| POST   | `/api/v1/properties`           | Create property             |
| PUT    | `/api/v1/properties/{id}`      | Update property             |
| DELETE | `/api/v1/properties/{id}`      | Delete property             |
| GET    | `/api/v1/requests`             | List all requests           |
| PATCH  | `/api/v1/requests/{id}/status` | Update request status       |
| POST   | `/api/v1/images/upload`        | Upload images to Cloudinary |

## Project Structure

```
src/main/java/com/taivillavungtau/backend/
├── controller/       # REST API endpoints
├── service/          # Business logic
├── repository/       # JPA repositories
├── entity/           # Database entities
├── dto/              # Request/Response DTOs
├── config/           # Configuration classes
├── security/         # JWT authentication
├── exception/        # Global error handling
└── websocket/        # Real-time notifications
```

## Database Schema

```
properties ──────┬──────── property_images
                 ├──────── property_amenities ─── amenities
                 └──────── location

requests ─────────────────── (standalone)
users ────────────────────── (auth)
```

## Running Locally

```bash
# Prerequisites: Java 17, MySQL 8.0

# 1. Configure database
cp src/main/resources/application.properties.example src/main/resources/application.properties
# Edit with your MySQL credentials

# 2. Run with Maven
mvn spring-boot:run

# 3. Access Swagger UI
open http://localhost:8080/swagger-ui.html
```

## Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Services:
# - Backend: port 8080
# - MySQL: port 3308
# - Redis: port 6381
```

## Environment Variables

| Variable                | Description         |
| ----------------------- | ------------------- |
| `MYSQL_ROOT_PASSWORD`   | MySQL root password |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account  |
| `CLOUDINARY_API_KEY`    | Cloudinary API key  |
| `CLOUDINARY_API_SECRET` | Cloudinary secret   |
| `JWT_SECRET`            | JWT signing key     |

## Key Features Implemented

- ✅ RESTful API with proper HTTP methods
- ✅ JWT authentication with refresh tokens
- ✅ Role-based authorization (ADMIN/USER)
- ✅ Database migrations with Flyway
- ✅ Redis caching for frequent queries
- ✅ WebSocket for real-time notifications
- ✅ Global exception handling
- ✅ Request validation with Bean Validation
- ✅ Cloudinary integration for image uploads
- ✅ Health checks with Spring Actuator
