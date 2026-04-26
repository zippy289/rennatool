# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev          # start dev server (localhost:3000)
npm run build        # prisma generate + next build
npm run lint         # eslint

npm run db:push      # push schema changes to DB without a migration (dev only)
npm run db:migrate   # create and apply a named migration
npm run db:studio    # open Prisma Studio
npm run db:seed      # run prisma/seed.ts
```

There are no automated tests.

## Architecture

**Stack:** Next.js 14.2.3 App Router · Prisma + PostgreSQL · NextAuth v4 · Stripe · Tailwind CSS

### Auth

Auth is credentials-only (email + password). Config lives at `src/lib/auth/auth-options.ts`. Sessions use JWT; the user `id` is injected in the `jwt` callback and read as `(session.user as any).id`.

In API routes, get the session with:
```ts
const session = await getServerSession(authOptions);
```

There is no role field on `User` — "owner" and "renter" are inferred from context (owning tools vs. making bookings).

### Database

Prisma singleton is at `src/lib/db/index.ts`. Always import via `@/lib/db`. Schema is at `prisma/schema.prisma`.

Key model relationships:
- `User` → owns many `Tool`s, has many `Booking`s as renter
- `Tool` → has many `ToolImage`s, `Booking`s, `Review`s
- `Booking` → has one optional `Review`

Prices are stored as **floats in dollars** (not cents). Booking status flow: `PENDING` → `APPROVED` → `PAID` → `ACTIVE` → `RETURNED` → `COMPLETED`. Conflict detection in `POST /api/bookings` only blocks `PAID`, `ACTIVE`, and `APPROVED` statuses.

### Geo / Search

ZIP codes are geocoded via `zippopotam.us` (`src/lib/geo/index.ts`). Tools store `lat`, `lng`, `city`, `state`, `zipCode`. Proximity filtering uses a bounding-box calculation — there is no PostGIS. `buildGeoFilter()` returns Prisma `where` clauses for `lat`/`lng` ranges.

**The search page (`src/app/search/page.tsx`) currently uses hardcoded mock data (`ALL_TOOLS` array) and is not connected to the database.** Wiring it to the real API is an open task.

### Payments

Stripe is set up for Connect (owners have `stripeAccountId` and `stripeAccountStatus`). The platform fee is 15%, configurable via `PLATFORM_FEE_PERCENT` env var. `calcPricing()` in `src/app/api/bookings/route.ts` handles weekly/monthly discounts and computes `ownerEarnings`, `platformFee`, and `totalCharged`.

### Missing API route

`/list-tool/page.tsx` submits to `POST /api/tools` but **that route does not exist yet**. It needs to be created at `src/app/api/tools/route.ts`.

## Design System

Custom Tailwind tokens — use these instead of raw colors:

| Token | Value | Use |
|---|---|---|
| `brand` | `#E8620A` | primary orange |
| `ink` | `#1A1410` | dark text / dark nav bg |
| `canvas` | `#F5F0E8` | page background |
| `sand` | `#DDD4C4` | borders, dividers |

Fonts load from Google Fonts. Use `style={{ fontFamily: 'var(--font-display)' }}` for Playfair Display headings. Body text uses DM Sans via the `font-body` Tailwind class.

## Environment Variables

Copy `.env.example` to `.env`. Required for local dev:
- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_URL` + `NEXTAUTH_SECRET`
- `STRIPE_SECRET_KEY` + `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` + `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` + `CLOUDINARY_API_KEY` + `CLOUDINARY_API_SECRET`
