# CraftFlow — B2B Creator Manufacturing Marketplace

> Connects artisan manufacturers and designers with brands, retailers, and marketplaces for wholesale B2B ordering.

Similar to: **IndiaMART · Faire · Etsy Wholesale · Meesho Supplier Hub**

---

## What is CraftFlow?

CraftFlow is a full-stack B2B platform with two separate portals:

| Portal | Who uses it | Theme |
|---|---|---|
| **Creator Portal** | Bangle makers, jewelry designers, saree manufacturers, handicraft artists, candle makers, pottery artists | Indigo |
| **Brand Portal** | Fashion retailers, jewelry brands, marketplace sellers, boutique owners, eCommerce brands | Emerald |

Each side has its own dashboard, discovery page, order management, and profile — and every action on one side instantly notifies and updates the other.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL |
| ORM | Prisma 5 |
| Authentication | Clerk v5 |
| State Management | TanStack Query (React Query) |
| Icons | Lucide React |
| Runtime | Node.js |

---

## Prerequisites

Before setup, make sure you have installed:

- **Node.js** v18 or higher — https://nodejs.org
- **PostgreSQL** v14 or higher — https://www.postgresql.org/download/
- **pgAdmin 4** (optional, for managing your database visually) — https://www.pgadmin.org
- A **Clerk account** (free) — https://clerk.com

---

## Project Structure

```
craftflow/
├── prisma/
│   ├── schema.prisma          ← Database schema (15 models)
│   └── seed.ts                ← Demo data seeder
│
├── src/
│   ├── middleware.ts           ← Auth guard (must be here, not root)
│   │
│   ├── app/
│   │   ├── layout.tsx          ← Root layout with ClerkProvider
│   │   ├── page.tsx            ← Smart redirect (existing vs new users)
│   │   ├── globals.css
│   │   │
│   │   ├── sign-in/[[...rest]]/page.tsx
│   │   ├── sign-up/[[...rest]]/page.tsx
│   │   │
│   │   ├── onboarding/
│   │   │   ├── page.tsx        ← Role picker (Creator / Brand)
│   │   │   ├── creator/        ← Creator profile setup
│   │   │   └── brand/          ← Brand profile setup
│   │   │
│   │   ├── (creator)/          ← Creator portal (indigo theme)
│   │   │   ├── layout.tsx
│   │   │   └── creator/
│   │   │       ├── dashboard/
│   │   │       ├── discover/   ← Browse all brands
│   │   │       ├── requests/   ← Incoming collab requests
│   │   │       ├── orders/
│   │   │       │   └── [id]/   ← Order detail + production updates
│   │   │       ├── products/
│   │   │       │   └── new/
│   │   │       ├── shipments/
│   │   │       ├── earnings/
│   │   │       └── profile/
│   │   │           └── edit/   ← Edit profile
│   │   │
│   │   ├── (brand)/            ← Brand portal (emerald theme)
│   │   │   ├── layout.tsx
│   │   │   └── brand/
│   │   │       ├── dashboard/
│   │   │       ├── discover/   ← Browse all creators
│   │   │       ├── requests/   ← Incoming collab requests
│   │   │       ├── orders/
│   │   │       │   ├── new/    ← Place new order
│   │   │       │   └── [id]/   ← Order detail + sample review + payments
│   │   │       ├── warehouses/
│   │   │       ├── payments/
│   │   │       ├── contracts/
│   │   │       └── profile/
│   │   │           └── edit/   ← Edit profile
│   │   │
│   │   └── api/
│   │       ├── auth/register/
│   │       ├── auth/creator-profile/   ← GET, POST, PATCH
│   │       ├── auth/brand-profile/     ← GET, POST, PATCH
│   │       ├── orders/                 ← GET list, POST create
│   │       ├── orders/[id]/            ← GET detail
│   │       ├── orders/[id]/status/     ← PATCH → notifies brand
│   │       ├── orders/[id]/samples/    ← Request / Upload / Approve / Reject
│   │       ├── orders/[id]/shipments/  ← Dispatch → notifies brand
│   │       ├── orders/[id]/payments/   ← Release → notifies creator
│   │       ├── creators/               ← Discovery + search
│   │       ├── brands/                 ← Discovery + search
│   │       ├── brands/dashboard/       ← Live stats for brand sidebar
│   │       ├── creator/dashboard/      ← Live stats for creator sidebar
│   │       ├── collabs/                ← Send request (brand or creator)
│   │       ├── collabs/[id]/           ← Accept / Decline
│   │       ├── notifications/          ← List + mark read
│   │       ├── products/
│   │       └── warehouses/
│   │
│   ├── components/
│   │   ├── ui/                 ← Button, Input, Badge, Card, Progress
│   │   ├── shared/             ← Providers, NotificationsBell
│   │   ├── creator/            ← Sidebar, Header, OrderStatusUpdater,
│   │   │                          SampleUploader, ShipmentForm,
│   │   │                          RequestActions, BrandRequestForm
│   │   └── brand/              ← Sidebar, Header, CollabRequestForm,
│   │                              SampleRequester, SampleReviewer,
│   │                              PaymentForm, BrandRequestActions
│   │
│   ├── lib/
│   │   ├── prisma.ts           ← Prisma singleton
│   │   ├── auth.ts             ← requireCreator(), requireBrand()
│   │   └── notifications.ts    ← createNotification(), notifyBoth()
│   │
│   └── utils/
│       └── index.ts            ← formatCurrency, formatDate, status helpers
│
├── .env                        ← Your secrets (never commit this)
├── .env.example                ← Template to copy from
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Setup Guide

### Step 1 — Clone / Extract the project

Extract the zip file to your Desktop or Documents folder.

```powershell
cd C:\Users\YourName\Desktop\craftflow
```

### Step 2 — Create your database

Open **pgAdmin 4**:
1. Right-click **Databases** → **Create** → **Database**
2. Name it `craftflow`
3. Click **Save**

### Step 3 — Get your Clerk API keys

1. Go to **https://dashboard.clerk.com**
2. Create a new application called `craftflow`
3. Choose **Email + Password** as the sign-in method
4. Go to **API Keys** in the left sidebar
5. Copy your **Publishable key** and **Secret key**

### Step 4 — Create your `.env` file

Copy the example file:

```powershell
Copy-Item .env.example .env
notepad .env
```

Fill in your values:

```env
# Your PostgreSQL connection string
# IMPORTANT: If your password contains @ → encode it as %40
# Example: MyPass@123 → MyPass%40123
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/craftflow"

# From dashboard.clerk.com → API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxx

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 5 — Install and run

```powershell
npm install
npx prisma db push --force-reset
npm run db:seed
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## Available Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm run start` | Run production build |
| `npx prisma db push` | Push schema changes to database |
| `npx prisma db push --force-reset` | Drop all tables and recreate from schema |
| `npm run db:seed` | Load demo data (2 users, 3 orders, products) |
| `npx prisma studio` | Open visual database browser at port 5555 |

---

## User Flows

### New Creator signs up

1. Visit `/sign-up` → enter email and password
2. Choose **"I'm a Creator"**
3. Fill in business profile (name, city, categories, capacity)
4. Lands on `/creator/dashboard`
5. Add products under **My Products**
6. Brands discover you under their **Discover Creators** page
7. Receive collaboration requests → Accept or Decline
8. Receive orders → Update production stages → Upload samples → Ship

### Existing Creator signs in

1. Visit `/sign-in` → enter email and password
2. Goes directly to `/creator/dashboard` — no onboarding again

### New Brand signs up

1. Visit `/sign-up` → enter email and password
2. Choose **"I'm a Brand"**
3. Fill in company profile (name, contact, categories)
4. Lands on `/brand/dashboard`
5. Discover creators under **Discover Creators**
6. Send collaboration requests
7. Place orders → Request samples → Approve → Release payments
8. Track production in real time

### Existing Brand signs in

1. Visit `/sign-in` → enter email and password
2. Goes directly to `/brand/dashboard` — no onboarding again

---

## Key Features

### Bidirectional Discovery
- **Brands** browse all creators at `/brand/discover` — filter by category, search by name or city
- **Creators** browse all brands at `/creator/discover` — see who's sourcing what
- Either side can send a collaboration request directly from the listing
- Request sender sees **"Request Pending"** — receiver sees **Accept / Decline** buttons

### Real-time Notifications
Every action notifies the other party instantly:

| Action | Who gets notified |
|---|---|
| Brand places order | Creator |
| Creator updates production stage | Brand |
| Brand requests sample | Creator |
| Creator uploads sample | Brand |
| Brand approves/rejects sample | Creator |
| Creator ships order | Brand |
| Brand releases payment | Creator |
| Either sends collab request | The other party |
| Either accepts/declines request | The requester |

### Production Tracking (12 stages)
```
Confirmed → In Production → 25% → 50% → 75% → Complete
→ Quality Check → Packaging → Ready to Ship → Shipped → Delivered → Completed
```

### Live Badge Counts
Sidebar badge numbers (pending requests, active orders, sample reviews) are pulled live from the database every 30 seconds — never hardcoded.

### Profile Editing
Both creators and brands can edit their profiles at any time:
- Creator: `/creator/profile/edit`
- Brand: `/brand/profile/edit`

---

## Demo Data

Running `npm run db:seed` creates:

**Creator:** Priya Handicrafts, Jaipur (Bangles, Jewelry, Accessories)
- Email: `creator@craftflow.app`

**Brand:** Ethnique Retail Pvt Ltd, Bangalore
- Email: `brand@craftflow.app`

**Orders:**
- Order 1: In production at 50% — advance paid
- Order 2: Sample uploaded, awaiting brand review
- Order 3: Completed and delivered

> Note: These demo accounts use placeholder Clerk IDs and cannot be used to sign in. They exist to populate dashboards with realistic data when you log in with your own account.

---

## Common Errors and Fixes

### `Authentication failed against database server`
Your password in `DATABASE_URL` has a special character.

**Fix:** Encode `@` as `%40` in the URL.
```
# Wrong
DATABASE_URL="postgresql://postgres:Pass@123@localhost:5432/craftflow"

# Correct
DATABASE_URL="postgresql://postgres:Pass%40123@localhost:5432/craftflow"
```

### `Missing publishableKey`
Your `.env` file is missing or has wrong Clerk keys.

**Fix:** Make sure `.env` exists (not just `.env.example`) and has real keys from `dashboard.clerk.com`.

### `Unique constraint failed on orderNumber` during seed
The seed ran before on a previous database.

**Fix:**
```powershell
npx prisma db push --force-reset
npm run db:seed
```

### `Prisma schema validation error`
The `schema.prisma` file has formatting issues.

**Fix:** Download the fresh `schema.prisma` from the project and replace `prisma\schema.prisma`.

### Sign-in sends me to onboarding again
Your `.env` has the wrong redirect URL.

**Fix:** Make sure your `.env` has:
```
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
```

### `middleware.ts` not working / infinite redirect
The middleware file is in the wrong location.

**Fix:** It must be at `src/middleware.ts` — not in the project root.

### Inputs lose focus on every keystroke
This is a React bug caused by defining components inside render functions.

**Fix:** All form inputs in this project use individual `useState` per field to prevent this. If you add new forms, never define a component (`const F = ...`) inside another component's render function.

### `psql` command not found
PostgreSQL is not in your PATH.

**Fix:**
```powershell
$env:Path += ";C:\Program Files\PostgreSQL\16\bin"
```
Replace `16` with your actual PostgreSQL version.

---

## Database Models

| Model | Purpose |
|---|---|
| `User` | Clerk user with role (CREATOR/BRAND/ADMIN) |
| `CreatorProfile` | Business details, capacity, categories, earnings |
| `BrandProfile` | Company details, sourcing categories, spend tracking |
| `Product` | Creator's product catalog with pricing and MOQ |
| `Warehouse` | Brand's delivery locations |
| `CollabRequest` | Collaboration requests (either direction) with `initiatedBy` field |
| `Order` | Purchase orders with full status lifecycle |
| `OrderItem` | Line items within an order |
| `Sample` | Sample request/upload/approval workflow |
| `ProductionLog` | Stage-by-stage production history |
| `Shipment` | Courier and tracking information |
| `Payment` | Advance and final payment records |
| `Notification` | Real-time alerts for both portals |
| `ActivityLog` | Audit trail of all order actions |
| `Contract` | Digital contract tracking |

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ | Clerk public key (safe to expose) |
| `CLERK_SECRET_KEY` | ✅ | Clerk secret key (keep private) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | ✅ | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | ✅ | `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | ✅ | `/` (smart redirect) |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | ✅ | `/onboarding` |
| `NEXT_PUBLIC_APP_URL` | ✅ | `http://localhost:3000` |

---

## License

Private project. All rights reserved.
