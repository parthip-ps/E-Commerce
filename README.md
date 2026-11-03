# 🛍️ ShopNext — Full Stack E-Commerce Catalog

A production-ready Full Stack E-Commerce platform built with **Next.js 14** (App Router, SSR, SSG) and **Node.js + Express** (JWT Auth, Middleware).

---

## 🏗️ Architecture Overview

```
ecommerce/
├── backend/                  # Node.js + Express API
│   ├── server.js             # Entry point (middleware, routes, error handler)
│   ├── controllers/          # Business logic
│   │   ├── authController.js # Register, Login, Refresh, Logout, Me
│   │   ├── productController.js
│   │   └── cartController.js
│   ├── middleware/
│   │   ├── authMiddleware.js  # protect(), authorize(), optionalAuth()
│   │   ├── errorMiddleware.js # AppError class, notFound, errorHandler
│   │   └── loggerMiddleware.js # requestLogger, validate()
│   ├── models/
│   │   └── store.js          # In-memory data store (12 products, 2 users)
│   ├── routes/               # Express routers
│   └── utils/
│       ├── jwt.js            # generateAccessToken/RefreshToken, verify
│       ├── asyncHandler.js   # Wraps async handlers, auto-catches errors
│       └── apiResponse.js    # sendSuccess, sendError, sendPaginated
│
└── frontend/                 # Next.js 14 App Router
    ├── app/
    │   ├── layout.tsx         # Root layout (AuthProvider + CartProvider)
    │   ├── page.tsx           # Home — SSR featured products + categories
    │   ├── products/
    │   │   ├── page.tsx       # Product listing — SSR + filters + pagination
    │   │   ├── ProductFiltersClient.tsx  # Client-side filter UI
    │   │   └── [id]/
    │   │       ├── page.tsx   # Product detail — SSG + ISR (revalidate: 300)
    │   │       └── AddToCartButton.tsx
    │   ├── auth/
    │   │   ├── login/page.tsx
    │   │   └── register/page.tsx
    │   ├── dashboard/
    │   │   ├── page.tsx       # User dashboard (protected)
    │   │   └── admin/page.tsx # Admin panel (role-protected)
    │   ├── cart/page.tsx      # Cart (auth-protected)
    │   └── components/
    │       ├── AuthProvider.tsx   # React context + localStorage + cookies
    │       ├── CartProvider.tsx   # Cart state management
    │       ├── Navbar.tsx
    │       ├── ProductCard.tsx
    │       └── Footer.tsx
    ├── middleware.ts          # Next.js middleware — route protection + headers
    ├── lib/
    │   ├── api.ts             # Server-side (SSR/SSG) + client-side fetch
    │   └── auth.ts            # Login, Register, Logout, token refresh
    └── types/index.ts
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### 1. Start the Backend

```bash
cd backend
npm install
npm run dev
```
Backend runs on **http://localhost:5000**

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```
Frontend runs on **http://localhost:3000**

---

## 🔐 Demo Accounts

| Role  | Email               | Password    |
|-------|---------------------|-------------|
| Admin | admin@example.com   | admin123    |
| User  | john@example.com    | password123 |

> Or use the pre-filled demo buttons on the login page.

---

## ✨ Key Features

### Frontend (Next.js 14)
| Feature | Implementation |
|---------|----------------|
| **App Router** | `app/` directory with layouts, nested routes |
| **Server Components** | Homepage and product pages fetch data server-side |
| **SSR** | Products page renders with live data per request |
| **SSG + ISR** | Product detail pages pre-generated, revalidate every 5 min |
| **Next.js Middleware** | `middleware.ts` — auth guard, role check, security headers |
| **Route Protection** | `/dashboard`, `/cart` redirect to login if unauthenticated |
| **API Routes** | Direct backend calls with typed `clientFetch` / `serverFetch` |
| **Suspense** | Loading skeletons while async server components stream |

### Backend (Node.js + Express)
| Feature | Implementation |
|---------|----------------|
| **JWT Auth** | Access token (7d) + Refresh token (30d) |
| **Custom Middleware** | `protect()`, `authorize()`, `optionalAuth()` |
| **Error Handling** | `AppError` class + global `errorHandler` middleware |
| **Async Handlers** | `asyncHandler()` wrapper — no try/catch in controllers |
| **Rate Limiting** | Global 200 req/15min + Auth routes 20 req/15min |
| **Security** | Helmet, CORS, input validation (express-validator) |
| **Role-Based Auth** | Admin-only product/user management routes |

---

## 📡 API Endpoints

### Auth
```
POST   /api/auth/register     Create new account
POST   /api/auth/login        Login + get tokens
POST   /api/auth/refresh      Refresh access token
POST   /api/auth/logout       Invalidate refresh token
GET    /api/auth/me           Get current user (🔒)
```

### Products
```
GET    /api/products          List with filters + pagination
GET    /api/products/featured Featured products
GET    /api/products/categories All categories
GET    /api/products/:id      Single product
POST   /api/products          Create (🔒 admin)
PUT    /api/products/:id      Update (🔒 admin)
DELETE /api/products/:id      Delete (🔒 admin)
```

### Cart (all 🔒 authenticated)
```
GET    /api/cart              Get user's cart
POST   /api/cart/add          Add item
PUT    /api/cart/update       Update quantity
DELETE /api/cart/remove/:id   Remove item
DELETE /api/cart/clear        Clear cart
```

---

## 🛠️ Next Steps for Production

1. **Replace in-memory store** with MongoDB (Mongoose) or PostgreSQL (Prisma)
2. **Add email verification** on registration
3. **Implement Stripe payments** for checkout
4. **Add product reviews** with user ratings
5. **Setup Redis** for refresh token storage + rate limiting
6. **Add image uploads** with Cloudinary or S3
7. **Deploy** backend to Railway/Render, frontend to Vercel
# E-Commerce
