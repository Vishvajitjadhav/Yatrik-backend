# Architecture

## System overview
```
┌──────────────┐    HTTPS/JSON     ┌──────────────────────┐     JDBC    ┌────────────┐
│  React SPA   │  ───────────────▶ │  Spring Boot API     │ ──────────▶ │ PostgreSQL │
│ (/frontend)  │  ◀─────────────── │  /api/v1             │             └────────────┘
└──────────────┘   Bearer JWT      │  Controller→Service  │
       │                           │  →Repository         │
       │ redirect                  └──────────┬───────────┘
       ▼                                      │ Stripe API
   Stripe Checkout ◀───── webhook ────────────┘
```

## Backend (existing, Spring Boot, Java 21)
Layered: **Controller → Service → Repository**. Highlights:
- **Dynamic pricing** via strategy pattern (base, surge, occupancy, urgency, holiday).
- **Concurrency-safe booking** using DB row locking on inventory.
- **JWT + role-based** security (`GUEST`, `HOTEL_MANAGER`) — *added in Phase 0*.
- **Stripe** checkout + refund on cancel.

## Frontend (new, React SPA)
- **Vite + TypeScript** — fast dev, typed API contracts.
- **React Router** — routing + `ProtectedRoute` / role guards.
- **TanStack Query** — server state, caching, retries, loading/error states.
- **React Hook Form + Zod** — typed, validated forms.
- **Zustand** — lightweight client state (auth/session).
- **Tailwind + custom component library** — design tokens + reusable primitives.
- **axios** client — unwraps the `{data,error}` envelope, attaches JWT, normalizes errors.

### Folder structure (as built — Phase 1)
```
frontend/src/
  app/            # providers, router, query client, ProtectedRoute, RouteError
  components/
    ui/           # primitives (Button, Input, Modal, Drawer, Toast…) + barrel index
    layout/       # Navbar, Footer, AppLayout
    brand/        # Logo
  features/       # domain slices: auth, home, hotels (Phase 2), booking (Phase 3); manager comes in Phase 4
    <feature>/    #   pages + components/, hooks.ts, api.ts, schemas.ts
  lib/            # api client (axios), cn(), constants
  stores/         # zustand stores (authStore, toastStore)
  types/          # shared TS types (mirror API DTOs)
  styles/         # globals.css — Tailwind v4 @theme tokens
  hooks/          # shared hooks (added when first needed)
```
Path alias `@/*` → `src/*`. Dev tooling: **oxlint** (the Vite template default) + Prettier.
Vite dev server proxies `/api` → `http://localhost:8080` so the app calls `/api/v1/...` with no CORS.

### Why this stack (interview rationale)
TanStack Query removes hand-rolled fetch/loading/cache boilerplate; Zod gives one source of
truth for form + API types; feature-folder structure scales and keeps domains isolated; a
custom Tailwind component library shows design-system thinking without a heavy UI dependency.

## Environments
- Frontend dev: Vite `http://localhost:5173` → backend `http://localhost:8080/api/v1`.
- CORS configured in Phase 0 for the dev origin.
