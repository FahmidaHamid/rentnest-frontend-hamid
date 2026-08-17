# 🏠 RentNest Frontend

RentNest is a full-stack property marketplace for renting and purchasing properties. This repository contains the **Next.js frontend** for the RentNest application.

## Live Application

- **Frontend:** https://rentnest-frontend-hamid.vercel.app/
- **Backend API:** https://rental-platform-rentnest-hamid.vercel.app/

## Overview

The frontend provides role-aware interfaces for:

- Public users browsing available properties
- Tenants submitting RENT and BUY requests
- Tenants completing approved transactions through Stripe
- Landlords creating and managing properties
- Administrators moderating property listings, property requests, users, and reviews

Users may have more than one role. For example, a tenant who successfully purchases a property becomes both a `TENANT` and a `LANDLORD`.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Axios
- React Hook Form
- Zod
- Stripe Elements
- Vercel

## Core Features

### Public Experience
- Home page
- Browse available properties
- Property detail pages
- Responsive property cards
- Remote property images

### Authentication
- Registration
- Login
- JWT-based authenticated sessions
- Role-aware navigation/dashboard access
- Auth state through `AuthProvider`

### Tenant Dashboard
- Browse eligible properties
- Submit RENT or BUY requests
- View personal property requests
- Track request status
- Start or resume approved payments
- Stripe Elements checkout
- View payment state

### Landlord Dashboard
- View owned properties
- Create new property listings
- Edit pending listings
- View property details
- Property ownership automatically reflects backend ownership transfer after a successful purchase

### Admin Dashboard
- View and moderate pending properties
- Approve a listing only for the landlord's requested status
- Reject pending listings
- View property requests
- Approve/reject tenant requests
- Review moderation

### Optimistic Concurrency in Admin Moderation

The frontend sends the `updated_at` value of the property version reviewed by the administrator:

```json
{
  "status": "AVAILABLE_FOR_RENT",
  "reviewed_updated_at": "2026-08-16T..."
}
```

If the landlord edits the property after the administrator loaded it, the backend returns `409 Conflict`.

The administrator must review the newest property version before approving/rejecting it.

### Payments

The frontend integrates Stripe Elements with the RentNest backend payment lifecycle.

Payment can begin only after a tenant request is approved.

The frontend supports:

- initiating checkout
- continuing a retryable PaymentIntent
- declined-card retry
- successful payment completion
- payment status retrieval

The backend remains the source of truth for payment amount, transaction status, property status, and ownership transfer.

## Project Structure

```text
.
├── public
├── src
│   ├── app
│   │   ├── (dashboard)
│   │   ├── (public)
│   │   ├── admin
│   │   ├── properties
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── assets
│   ├── components
│   │   ├── admin
│   │   ├── forms
│   │   ├── layout
│   │   ├── payments
│   │   ├── review
│   │   ├── shared
│   │   └── ui
│   ├── constants
│   ├── hooks
│   │   ├── use-admin-properties.ts
│   │   ├── use-admin-requests.ts
│   │   ├── useAuth.ts
│   │   ├── useLandlordProperty.ts
│   │   ├── usePayment.ts
│   │   ├── useReview.ts
│   │   └── useTenantRequests.ts
│   ├── lib
│   │   ├── auth-storage.ts
│   │   ├── axios.ts
│   │   └── utils.ts
│   ├── providers
│   │   ├── AuthProvider.tsx
│   │   └── QueryProvider.tsx
│   ├── services
│   │   ├── admin.service.ts
│   │   ├── auth.service.ts
│   │   ├── landlord.service.ts
│   │   ├── payment.service.ts
│   │   ├── property.service.ts
│   │   ├── review.service.ts
│   │   └── tenant.service.ts
│   ├── types
│   │   ├── admin.ts
│   │   ├── auth.ts
│   │   ├── payment.ts
│   │   ├── property.ts
│   │   ├── request.ts
│   │   └── review.ts
│   └── utils
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
└── README.md
```

## Application Routes

Current App Router routes include:

```text
/
 /login
 /register
 /properties
 /properties/[id]

 /dashboard
 /dashboard/tenant
 /dashboard/tenant/requests

 /dashboard/landlord
 /dashboard/landlord/properties
 /dashboard/landlord/properties/new
 /dashboard/landlord/properties/[id]
 /dashboard/landlord/properties/[id]/edit

 /admin
 /admin/properties
 /admin/requests
 /admin/reviews
```

## Local Setup

### 1. Clone and install

```bash
git clone <FRONTEND_REPOSITORY_URL>
cd rentnest-client
pnpm install
```

### 2. Environment variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

For the deployed frontend:

```env
NEXT_PUBLIC_API_URL=https://rental-platform-rentnest-hamid.vercel.app/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Do not place Stripe secret keys in the frontend.

### 3. Start development

```bash
pnpm dev
```

Default local frontend:

```text
http://localhost:3000
```

## Production Build

Before deployment:

```bash
pnpm build
```

The project currently passes the optimized Next.js production build and TypeScript validation.

## Deployment

The frontend is deployed through Vercel and connected to GitHub.

Pushing to the configured production branch triggers a Vercel deployment.

Production environment variables required in Vercel:

```text
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

Current live frontend:

https://rentnest-frontend-hamid.vercel.app/

## Testing Summary

The frontend participated in six structured testing phases together with the backend.

### Phase 1 — Property Moderation and Concurrency
**PASS**

Verified stale timestamps return `409`, while refreshed property versions can be approved.

### Phase 2 — Tenant Request Rules
**PASS**

Verified RENT/BUY compatibility, admin decisions, competing requests, and unavailable-property restrictions.

### Phase 3 — Payments
**PASS**

Verified successful payment, declined-card retry, and business-payment reuse.

### Phase 4 — Ownership and Role Integrity
**PASS**

Verified successful purchase moves the property to the buyer and adds landlord capability without removing the seller's landlord role.

### Phase 5 — Authentication and Frontend State
**PASS with minor UX limitation**

A user promoted from tenant to landlord may need to refresh the page before the frontend reflects the new role.

### Phase 6 — Deployed Smoke Test
**PASS**

Verified the deployed frontend against the deployed backend/Neon data for public, tenant, landlord, and admin flows.

## Known Limitations

The current frontend is intentionally scoped as an MVP.

- Newly granted roles may require a page refresh before navigation/dashboard state updates.
- Dedicated tenant/landlord profile editing is not implemented.
- First-time buyers receive a landlord profile from the backend, but optional profile fields are not yet editable in the UI.
- Property-image editing is not included.
- Rejected tenants cannot reapply for the same property.
- No real-time/email notifications.
- Search and filtering are basic.
- No payment history/refund UI.
- No ownership-history UI.
- Automated frontend test coverage is limited.

## Future Work

- Refetch authenticated user immediately after a role change
- Profile management and profile completion
- Property image editing
- More flexible reapplication rules
- Notifications
- Advanced property search/filtering
- Payment history and refunds
- Ownership history
- Ratings and richer review UX
- Automated unit/integration/E2E tests
- Accessibility and responsive-polish pass
- Observability and production analytics

## Backend

Backend repository/service:

https://rental-platform-rentnest-hamid.vercel.app/

Public API example:

https://rental-platform-rentnest-hamid.vercel.app/api/properties

## Author

**Fahmida Hamid**

RentNest was developed as a practical full-stack project focused on modern React/Next.js application structure, role-based UX, API integration, Stripe checkout, business-rule enforcement, and production deployment.
