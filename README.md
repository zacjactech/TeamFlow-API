# TeamFlow

Scalable REST API with Authentication and Role-Based Access Control (RBAC) and a Next.js Frontend.

## Project Overview

TeamFlow is a multi-tenant task management platform built with modern engineering practices. It features a robust backend using NestJS, Prisma, and PostgreSQL, and a premium frontend built with Next.js 15 and TailwindCSS.

### Key Features
- **Multi-tenancy:** Users belong to organizations, and data is strictly isolated between tenants.
- **RBAC:** Role-Based Access Control (Admin and Member roles) for secure operations.
- **JWT Auth:** Secure authentication with bcrypt password hashing.
- **Swagger Documentation:** Automatically generated API docs.
- **Dockerized:** Containerized for easy deployment and local development.
- **Premium UI:** Responsive and modern dashboard with real-time feedback.

---

## Tech Stack

### Backend
- **Framework:** NestJS
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Security:** Passport JWT, bcrypt, Helmet, Compression, Throttling
- **Validation:** class-validator, class-transformer
- **Documentation:** Swagger

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Styling:** TailwindCSS
- **API Client:** Axios
- **State Management:** React Context API
- **Icons:** Lucide React

---

## Getting Started

### Prerequisites
- Node.js (v20+)
- pnpm
- Docker and Docker Compose

### Fast Track (Docker)
1. Clone the repository.
2. Run: `docker-compose up --build`
3. Backend: `http://localhost:3000`
4. Frontend: `http://localhost:3001`
5. API Docs: `http://localhost:3000/api/docs`

### Manual Setup

#### 1. Backend
```bash
cd backend
pnpm install
# Configure .env
cp .env.example .env
# Database migration
npx prisma migrate dev
# Run development
pnpm run start:dev
```

#### 2. Frontend
```bash
cd frontend
pnpm install
# Configure .env.local
cp .env.local.example .env.local
# Run development
pnpm run dev
```

---

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Create account & organization
- `POST /api/v1/auth/login` - Get access token

### Tasks
- `GET /api/v1/tasks` - List org tasks
- `POST /api/v1/tasks` - Create task
- `GET /api/v1/tasks/:id` - Get specific task
- `PATCH /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task (Admin only)

### Users
- `GET /api/v1/users` - List org users (Admin only)
- `GET /api/v1/users/me` - Get current profile

---

## Architecture Design

The project follows **Clean Architecture** and **Modular Design**:
- **Common:** Shared decorators, filters, guards, and interceptors.
- **Modules:** Business features (Auth, Users, Tasks, Organizations) are encapsulated.
- **Prisma:** Centralized data access.
- **Next.js App Router:** Modern SSR and CSR patterns balanced for performance.

---

## Security Implementation
- **Password Hashing:** Argon2/Bcrypt (using bcrypt in this implementation).
- **Rate Limiting:** NestJS Throttler protects against brute force.
- **HTTP Headers:** Helmet secures Express headers.
- **CORS:** Controlled access for the frontend.
- **Input Sanitization:** Class-validator prevents injection and invalid data.

---

## License
MIT
