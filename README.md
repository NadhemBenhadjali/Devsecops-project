# ConsumeSafe - مستهلك آمن

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-18.2.0-blue)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22.0-2D3748)](https://www.prisma.io/)
[![Security](https://img.shields.io/badge/security-JWT%20%7C%20helmet%20%7C%20rate--limit-blue)](https://jwt.io/)
[![DevSecOps](https://img.shields.io/badge/DevSecOps-CI%2FCD%20%7C%20CodeQL-success)](https://github.com/features/security)

**ConsumeSafe** is a full-stack web application with **enterprise-grade authentication and role-based access control** designed to help Tunisian consumers make informed purchasing decisions by providing information about product boycotts and suggesting local alternatives.

> **استهلك بوعي • Consommez consciemment • Consume Consciously**

🔐 **New Features**: JWT Authentication • Role-Based Access Control • PostgreSQL Database • Prisma ORM • Admin Management

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [DevSecOps Implementation](#devsecops-implementation)
- [Getting Started](#getting-started)
  - [Run Locally (Recommended First)](#run-locally-recommended-first)
  - [Run with Docker](#run-with-docker)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database](#database)
- [API Endpoints](#api-endpoints)
- [Security Best Practices](#security-best-practices)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

ConsumeSafe empowers Tunisian consumers to:
- Check if products are subject to boycotts
- Search through a database of **272 products**
- Discover local Tunisian alternatives
- Support ethical consumption and local economy

The application features a **trilingual interface** (Arabic, French, English) with a distinctive **Tunisian-themed design** using the national colors and Cairo typography for optimal Arabic readability.

---

## Features

### 🔐 Authentication & Authorization
- **JWT-Based Authentication**: Secure token-based user authentication
  - 7-day token expiration
  - bcrypt password hashing (12 rounds)
  - Automatic token refresh on login
  
- **Role-Based Access Control (RBAC)**: Two-tier permission system
  - **USER Role**: Search and view products only
  - **ADMIN Role**: Full access to add/update products and manage boycott status
  
- **Protected API Routes**: Middleware-based route protection
  - Authentication middleware verifies JWT tokens
  - Authorization middleware checks user roles
  - Secure admin-only endpoints
  
- **User Management**:
  - Login/Logout functionality
  - User registration with automatic USER role assignment
  - Role badge display in UI
  - Persistent authentication with localStorage

### Smart Product Search
- Real-time search across product database
- Instant results with live status indicator
- Case-insensitive search in Arabic, French, and English
- Public access (no authentication required)

### Product Information
- **Boycott Status**: Clear visual indicators (Boycotted / Safe)
- **Product Details**: Name, brand, category, and reason for boycott
- **Alternatives**: Tunisian product recommendations
- **Visual Design**: Color-coded cards (red for boycotted, green for safe)
- **Admin Controls**: Toggle boycott status (admin only)

### Admin Features (🔒 Admin Only)
- **Add New Products**: Modal-based product entry form
- **Update Boycott Status**: Toggle product boycott status
- **Audit Logging**: All admin actions are logged with user email
- **Protected UI**: Admin controls only visible to authenticated admins

### Tunisian-Themed UI
- Dark gradient background (#1a1a1a to #2d1a1a)
- Red accent colors (#E31837) representing the Tunisian flag
- Geometric patterns inspired by traditional Tunisian architecture
- Cairo font for elegant Arabic typography
- Responsive design with Tailwind CSS

### Multilingual Support
- Arabic (العربية) - Primary language
- French (Français) - Secondary language
- English - International accessibility

---

## DevSecOps Implementation

This project implements **DevSecOps best practices** throughout the development lifecycle, ensuring security, quality, and reliability from development to deployment.

### Security Hardening (Dev Phase)

#### Backend Security
- **JWT Authentication**: Industry-standard token-based authentication
  - Secure token generation with `jsonwebtoken`
  - 7-day token expiration
  - Bearer token authorization headers
  - Protected routes with authentication middleware
  
- **Password Security**: bcrypt hashing algorithm
  - 12 salt rounds for strong password protection
  - Secure password verification
  - No plaintext password storage
  
- **Role-Based Authorization**: Granular access control
  - User roles: USER (read-only) and ADMIN (full access)
  - Authorization middleware for protected routes
  - Role validation on every admin request
  
- **Audit Logging**: Complete action tracking
  - All admin operations logged with user email
  - Timestamp tracking for security events
  - Product creation/update audit trail
  
- **Helmet.js Integration**: Automatically sets secure HTTP headers
  - Content Security Policy (CSP)
  - X-Frame-Options (clickjacking protection)
  - X-Content-Type-Options (MIME sniffing protection)
  - Strict-Transport-Security (HSTS)
  - X-XSS-Protection
  
- **Rate Limiting**: Protection against DDoS and brute-force attacks
  - Configurable request limits per IP
  - Prevents API abuse and credential stuffing
  
- **Input Validation with Zod**: Runtime type checking and validation
  - Validates all incoming requests
  - Prevents SQL injection and malformed data
  - Schema-based validation for product creation and authentication
  
- **Environment-Based CORS**: Controlled cross-origin resource sharing
  - Development: Allows localhost origins
  - Production: Restricts to specific domains
  - Configurable via environment variables
  
- **Global Error Handler**: Centralized error management
  - Prevents sensitive information leakage
  - Logs errors securely
  - Returns safe error messages to clients

#### Frontend Security
- **Token Management**: Secure client-side token handling
  - localStorage for token persistence
  - Automatic token inclusion in API requests
  - Token cleanup on logout
  
- **Protected Routes**: Role-based UI rendering
  - Conditional component rendering based on authentication
  - Role-specific UI elements (admin controls)
  - Automatic redirection for unauthorized access
  
- **Environment Variables**: Sensitive configuration stored in `.env` files
- **API URL Configuration**: Separate configs for dev/prod environments
- **Input Sanitization**: Client-side validation before API calls

#### Database Security
- **PostgreSQL**: Enterprise-grade relational database
  - Strong data consistency and integrity
  - ACID compliance for reliable transactions
  - Docker volume for data persistence
  
- **Prisma ORM**: Type-safe database access
  - SQL injection prevention through parameterized queries
  - Type-safe database operations
  - Automatic schema validation
  - Migration management for database evolution

### Continuous Integration & Deployment (Sec Phase)

#### GitHub Actions CI/CD Pipeline
Located in `.github/workflows/`, the pipeline includes:

**1. Automated Testing**
- Runs on every push and pull request
- Tests both frontend and backend
- Ensures code quality before merge

**2. Security Scanning**
- **CodeQL Analysis**: Automated vulnerability detection
  - Scans for common security issues
  - Identifies potential code vulnerabilities
  - Provides actionable security recommendations
  
- **npm audit**: Dependency vulnerability checking
  - Scans all dependencies for known CVEs
  - Alerts on vulnerable packages
  - Suggests security updates

**3. Dependency Management**
- **Dependabot**: Automated dependency updates
  - Weekly security updates
  - Automatic pull requests for vulnerable dependencies
  - Keeps dependencies up-to-date

#### Docker Security (Ops Phase)

**Containerization Benefits**:
- **Isolation**: Application runs in isolated containers
- **Reproducibility**: Consistent environment across dev/staging/prod
- **Resource Control**: Memory and CPU limits
- **Image Security**: Uses official Node.js base images

**Docker Compose Configuration**:
```yaml
services:
  frontend:
    - Health checks
    - Port mapping
    - Environment isolation
    
  backend:
    - Separate container
    - Database volume persistence
    - Network isolation
```

### Security Features Summary

| Feature | Implementation | Benefit |
|---------|---------------|---------|
| **JWT Authentication** | jsonwebtoken | Secure, stateless authentication |
| **Password Hashing** | bcrypt (12 rounds) | Strong password protection |
| **Role-Based Access** | USER/ADMIN roles | Granular permission control |
| **Audit Logging** | User action tracking | Security event monitoring |
| **Helmet.js** | HTTP security headers | Protects against common web vulnerabilities |
| **Rate Limiting** | express-rate-limit | Prevents DDoS and brute-force attacks |
| **Input Validation** | Zod schemas | Blocks malformed/malicious input |
| **CORS Configuration** | Environment-based | Controls API access |
| **Error Handling** | Global middleware | Prevents info leakage |
| **Prisma ORM** | Type-safe queries | SQL injection prevention |
| **PostgreSQL** | ACID database | Data integrity and consistency |
| **CodeQL** | GitHub Actions | Automated security scanning |
| **npm audit** | CI/CD pipeline | Dependency vulnerability detection |
| **Dependabot** | GitHub integration | Automated security updates |
| **Docker** | Containerization | Isolation and consistency |
| **Environment Variables** | .env files | Secret management |

### DevSecOps Workflow

```
┌──────────────┐
│ Development  │ → Security headers, validation, error handling
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Git Push     │ → Triggers CI/CD pipeline
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ CI Pipeline  │ → npm audit, CodeQL, tests
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Security OK? │ → Pass: Continue | Fail: Alert developer
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Build        │ → Docker images created
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Deployment   │ → Secure containerized application
└──────────────┘
```

---

## Getting Started

### Prerequisites
- **Node.js** version 20 or higher
- **npm** (comes with Node.js)
- **Docker & Docker Compose** (for containerized deployment)
- **Git** (for cloning the repository)

---

### Run with Docker (Recommended)

#### Step 1: Clone the Repository
```bash
git clone https://github.com/oumaymahammami/ConsumeSafe.git
cd ConsumeSafe
```

#### Step 2: Setup Environment Files
```bash
# Copy environment examples
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

**Important**: Update `backend/.env` with your JWT secret for production:
```bash
JWT_SECRET=your_super_secure_secret_here_change_me
JWT_EXPIRES_IN=7d
```

#### Step 3: Start All Services with Docker Compose
```bash
docker compose up --build
```

**What happens:**
- 🐘 **PostgreSQL 16** database starts on port 5433
- 🔧 **Backend API** builds and starts on port 5050
- ⚛️ **Frontend Vite dev server** starts on port 5173
- 🗄️ Database automatically seeded with admin user and sample products
- 📦 All services run in isolated containers with health checks

#### Step 4: Access the Application

**Frontend:** http://localhost:5173  
**Backend API:** http://localhost:5050/api  
**PostgreSQL:** localhost:5433 (external) / db:5432 (internal)

#### Step 5: Login

**Admin Account (Pre-created):**
```
Email: admin@consumesafe.tn
Password: Admin123!
Role: ADMIN (full access)
```

**Create New User:**
```bash
curl -X POST http://localhost:5050/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "YourPassword123!"
  }'
```
New users automatically get USER role (search-only access).

#### Useful Docker Commands
```bash
# Stop all services
docker compose down

# Stop and remove volumes (⚠️ deletes database data)
docker compose down -v

# View logs
docker compose logs -f

# Rebuild containers
docker compose up --build

# Run backend terminal
docker compose exec backend sh

# Access PostgreSQL
docker compose exec db psql -U consumesafe -d consumesafe_db
```

---

### Run Locally (Development Mode)

#### Step 1: Clone the Repository
```bash
git clone https://github.com/oumaymahammami/ConsumeSafe.git
cd ConsumeSafe
```

#### Step 2: Setup PostgreSQL Database
You need a running PostgreSQL instance. Update `backend/.env`:
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/consumesafe_db"
JWT_SECRET="your_secure_secret"
JWT_EXPIRES_IN="7d"
```

#### Step 3: Backend Setup
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

**Backend runs on:** http://localhost:5050

**What happens:**
- Dependencies installed (Express, Prisma, JWT, bcrypt, etc.)
- Prisma client generated from schema
- Database schema synced
- Database seeded with admin user and products
- Development server starts with nodemon

#### Step 4: Frontend Setup (New Terminal)
```bash
cd frontend
npm install
npm run dev
```

**Frontend runs on:** http://localhost:5173

**What happens:**
- Dependencies installed (React, Vite, Tailwind, axios)
- Vite development server starts with hot module replacement

#### Step 5: Access the Application
```
http://localhost:5173
```

Login with: `admin@consumesafe.tn` / `Admin123!`

---

### Run with Docker (1 Command Only)

For a quick containerized deployment without local Node.js setup:

#### Step 1: Prepare Environment Files
From the **root folder**:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

#### Step 2: Build and Run
```bash
docker compose up --build
```

**What happens:**
- Builds Docker images for frontend and backend
- Creates isolated containers
- Sets up internal networking
- Starts both services

**Access Points:**
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5050

**Stop the containers:**
```bash
docker compose down
```

**View logs:**
```bash
docker compose logs -f
```

---

## Architecture

```
┌─────────────────┐
│                 │
│   Frontend      │
│   (React+Vite)  │
│   Port: 5173    │
│                 │
└────────┬────────┘
         │
         │ HTTP/REST API + JWT Auth
         │
┌────────▼────────┐
│                 │
│   Backend       │
│   (Express.js)  │
│   Port: 5050    │
│                 │
└────────┬────────┘
         │
         │ Prisma ORM
         │
┌────────▼────────┐
│                 │
│  PostgreSQL 16  │
│  Port: 5433     │
│  (Docker)       │
│                 │
└─────────────────┘
```

**Data Flow:**
1. User logs in → JWT token issued and stored in localStorage
2. User searches for a product → Frontend sends GET request with Bearer token
3. Backend verifies JWT → Express routes process request via Prisma ORM
4. PostgreSQL returns results → Backend sends JSON response
5. Frontend displays color-coded product cards with role-based controls
6. Admin actions (add/update) → Protected routes verify ADMIN role
7. Audit logs track all admin operations with user email

**Authentication Flow:**
```
┌──────────┐     POST /api/auth/login     ┌──────────┐
│ Frontend │ ────────────────────────────> │ Backend  │
│          │     { email, password }       │          │
│          │                               │  bcrypt  │
│          │                               │  verify  │
│          │     <────────────────────────>│          │
│          │     { token, user, role }     │   JWT    │
│          │                               │  sign    │
└────┬─────┘                               └──────────┘
     │
     │ Store token in localStorage
     │
┌────▼─────┐     All API requests         ┌──────────┐
│ Frontend │ ────────────────────────────> │ Backend  │
│          │  Authorization: Bearer token  │          │
│          │                               │  verify  │
│          │     <────────────────────────>│  & check │
│          │        Protected data         │   role   │
└──────────┘                               └──────────┘
```

---

## Tech Stack

### Frontend
- **React 18.2.0** - UI library with hooks and context
- **Vite 7.3.0** - Fast build tool and dev server (upgraded for security)
- **Tailwind CSS 3.4.1** - Utility-first styling
- **Axios 1.6.5** - HTTP client with interceptors for JWT
- **React Context API** - Global authentication state management
- **Google Fonts (Cairo)** - Arabic-friendly typography

### Backend
- **Node.js 20+** - JavaScript runtime (Alpine Linux in Docker)
- **Express 4.18.2** - Web framework
- **PostgreSQL 16** - Enterprise-grade relational database
- **Prisma 5.22.0** - Modern ORM with type safety
- **jsonwebtoken** - JWT token generation and verification
- **bcrypt** - Password hashing (12 rounds)
- **Helmet.js** - Security headers middleware
- **express-rate-limit** - Rate limiting protection
- **Zod** - Schema validation library
- **CORS 2.8.5** - Cross-origin resource sharing
- **Nodemon 3.0.2** - Development auto-reload
- **OpenSSL** - Required for Prisma on Alpine Linux

### Database & ORM
- **PostgreSQL 16 Alpine** - Docker containerized database
- **Prisma Client** - Type-safe database access
- **Prisma Schema** - Declarative database modeling
- **Prisma Migrate** - Database schema versioning

### DevSecOps Tools
- **Docker & Docker Compose** - Multi-container orchestration
- **GitHub Actions** - CI/CD automation
- **CodeQL** - Security vulnerability scanning
- **npm audit** - Dependency security checks
- **Dependabot** - Automated dependency updates
- **ESLint** - Code quality linting

---

## Project Structure

```
ConsumeSafe/
│
├── .github/
│   └── workflows/
│       ├── ci.yml                 # CI/CD pipeline
│       └── codeql-analysis.yml    # Security scanning
│
├── backend/
│   ├── src/
│   │   ├── server.js              # Express server + JWT auth
│   │   ├── db/
│   │   │   ├── init.js            # Database initialization (deprecated)
│   │   │   └── seed.js            # Seed admin + products
│   │   ├── routes/
│   │   │   ├── products.js        # Product API with RBAC
│   │   │   └── auth.js            # Login/register endpoints
│   │   └── middleware/
│   │       └── auth.js            # JWT auth + admin middleware
│   ├── prisma/
│   │   ├── schema.prisma          # Prisma data models
│   │   └── seed.js                # Database seeding
│   ├── .env.example               # Environment template with JWT
│   ├── .gitignore                 # Ignored files
│   ├── Dockerfile                 # Backend container (Alpine + OpenSSL)
│   └── package.json               # Dependencies + Prisma scripts
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx               # Entry point with AuthProvider
│   │   ├── App.jsx                # Main component with role-based UI
│   │   ├── index.css              # Global styles
│   │   ├── auth/
│   │   │   └── AuthContext.jsx    # JWT token & state management
│   │   └── components/
│   │       ├── Header.jsx         # Header with login/logout
│   │       ├── SearchBar.jsx      # Search input
│   │       ├── ProductCard.jsx    # Product display
│   │       ├── AddProductModal.jsx # Add product (admin only)
│   │       └── LoginModal.jsx     # Login form
│   ├── .env.example               # Environment template
│   ├── .gitignore                 # Ignored files
│   ├── Dockerfile                 # Frontend container
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json               # Dependencies + scripts
│
├── .gitignore                     # Root ignore rules
├── docker-compose.yml             # PostgreSQL + Backend + Frontend
└── README.md                      # This file
```

---

## Database

### PostgreSQL Schema (via Prisma)

The database contains two main tables: `products` and `users`

#### Products Table
```prisma
model Product {
  id           Int      @id @default(autoincrement())
  name         String
  name_ar      String?
  brand        String
  category     String
  is_boycotted Boolean  @default(false)
  reason       String?
  alternative  String?

  @@map("products")
}
```

#### Users Table
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String   // bcrypt hashed
  role      Role     @default(USER)
  createdAt DateTime @default(now())

  @@map("users")
}

enum Role {
  USER
  ADMIN
}
```

### Seeded Data
- **Admin User**: `admin@consumesafe.tn` with ADMIN role
- **10 Sample Products**: Pre-loaded with boycott status and alternatives
- Password hashed with bcrypt (12 rounds)

### Database Location
```
backend/consumesafe.sqlite
```

### Seeding Data
The database is seeded from `consumesafe_large_seed.json` containing **272 products** across categories:
- Beverages
- Dairy Products
- Snacks & Sweets
- Personal Care
- Household Products
- Food Products
- Coffee & Tea

To re-seed the database:
```bash
cd backend
npm run seed
```

---

## API Endpoints

### Base URL
```
http://localhost:5050/api
```

---

### Authentication Endpoints

#### POST `/auth/register`
Create a new user account (automatically assigned USER role).

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "YourPassword123!"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "email": "user@example.com",
    "role": "USER"
  }
}
```

#### POST `/auth/login`
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "admin@consumesafe.tn",
  "password": "Admin123!"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@consumesafe.tn",
    "role": "ADMIN"
  }
}
```

**Security:**
- Passwords hashed with bcrypt (12 rounds)
- JWT tokens expire after 7 days
- Rate limited to prevent brute-force attacks

---

### Product Endpoints

#### GET `/products`
Retrieve all products or search by query.

**Authorization:** None (public endpoint)

**Query Parameters:**
- `search` (optional) - Search term for filtering products

**Request Example:**
```bash
curl "http://localhost:5050/api/products?search=cola"
```

**Response Example:**
```json
[
  {
    "id": 1,
    "name": "Coca-Cola",
    "name_ar": "كوكا كولا",
    "brand": "The Coca-Cola Company",
    "category": "Beverages",
    "is_boycotted": true,
    "reason": "Supports Israeli economy",
    "alternative": "Boga Cola (Tunisia)"
  }
]
```

#### GET `/products/search`
Search products by query parameter.

**Authorization:** None (public endpoint)

**Query Parameters:**
- `q` (required) - Search term

**Request Example:**
```bash
curl "http://localhost:5050/api/products/search?q=pepsi"
```

#### POST `/products`
Add a new product to the database.

**Authorization:** 🔒 **Required** - ADMIN role only

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Security:**
- Input validated with Zod schema
- Required fields enforced
- Type checking on all inputs

**Request Body:**
```json
{
  "name": "Product Name",
  "name_ar": "اسم المنتج",
  "brand": "Brand Name",
  "category": "Category",
  "is_boycotted": true,
  "reason": "Reason for boycott",
  "alternative": "Local alternative"
}
```

**Request Example with JWT:**
```bash
curl -X POST http://localhost:5050/api/products \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "brand": "Brand",
    "category": "Food",
    "is_boycotted": false
  }'
```

**Validation Rules:**
- `name`: Required string
- `name_ar`: Optional string
- `brand`: Required string
- `category`: Required string
- `is_boycotted`: Required boolean
- `reason`: Optional string (recommended if boycotted)
- `alternative`: Optional string

**Response:**
```json
{
  "id": 11,
  "name": "New Product",
  "brand": "Brand",
  "category": "Food",
  "is_boycotted": false,
  "reason": null,
  "alternative": null
}
```

**Audit Log:** All product creations are logged with admin user email.

---

#### PATCH `/products/:id/toggle`
Toggle boycott status of a product.

**Authorization:** 🔒 **Required** - ADMIN role only

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Example:**
```bash
curl -X PATCH http://localhost:5050/api/products/1/toggle \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "id": 1,
  "name": "Coca-Cola",
  "is_boycotted": false
}
```

**Audit Log:** Status changes logged with admin user email.

---

### Error Responses

**401 Unauthorized** - Missing or invalid JWT token
```json
{
  "error": "Access denied. No token provided."
}
```

**403 Forbidden** - Valid token but insufficient permissions
```json
{
  "error": "Admin only"
}
```

**400 Bad Request** - Invalid input data
```json
{
  "error": "Validation error message"
}
```

**404 Not Found** - Product not found
```json
{
  "error": "Product not found"
}
```

---

## Security Best Practices

### For Developers

1. **Never Commit Sensitive Data**
   - Use `.env` files for secrets
   - Add `.env` to `.gitignore`
   - Use `.env.example` as template

2. **Keep Dependencies Updated**
   - Run `npm audit` regularly
   - Review Dependabot PRs promptly
   - Update packages with security patches

3. **Validate All Inputs**
   - Use Zod schemas for validation
   - Sanitize user inputs
   - Never trust client-side data

4. **Use Security Headers**
   - Helmet.js is configured by default
   - Review CSP policies
   - Enable HSTS in production

5. **Implement Rate Limiting**
   - Configured for API endpoints
   - Adjust limits based on needs
   - Monitor for abuse patterns

### For Deployment

1. **Environment Configuration**
   - Set proper CORS origins in production
   - Use strong secrets for production
   - Enable HTTPS/SSL certificates

2. **Docker Security**
   - Use official base images
   - Run containers as non-root user
   - Scan images for vulnerabilities

3. **Monitoring**
   - Enable application logging
   - Monitor rate limit violations
   - Set up alerts for security events

---

## Contributing

We welcome contributions to ConsumeSafe! Here's how you can help:

### Reporting Issues
- Check if the issue already exists
- Provide detailed description
- Include steps to reproduce
- Add screenshots if applicable

### Suggesting Features
- Explain the feature clearly
- Describe use cases
- Consider impact on existing functionality

### Code Contributions
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m "Add feature description"`
6. Push: `git push origin feature-name`
7. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Write clear commit messages
- Update documentation
- Test on multiple browsers
- Ensure responsive design works
- Run security checks before PR

---

## License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2024 ConsumeSafe

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Contact & Support

- **GitHub**: [github.com/oumaymahammami/ConsumeSafe](https://github.com/oumaymahammami/ConsumeSafe)
- **Issues**: Report bugs or request features via GitHub Issues

---

## Acknowledgments

- Tunisian community for local product information
- Open-source contributors
- All users supporting ethical consumption

---

<div align="center">

**Made with care in Tunisia**

*استهلك بوعي • Consommez consciemment • Consume Consciously*

</div>
