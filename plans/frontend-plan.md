# YATRIK — Frontend Delivery Plan

> **Goal:** Add a clean, Airbnb-inspired, fully responsive React frontend to the existing
> Spring Boot backend. Terracotta `#E4572E` (primary) + white + teal trust accent. Reusable components, strong UX detailing,
> FAANG-interview-grade code and system design.
>
> **How to use this file:** Each phase is a reviewable unit. We implement → test locally →
> tick the boxes → review together → move to the next phase. Only merge to `master` after review.

**Branch:** `feature/frontend`
**Stack:** React + Vite + TypeScript · React Router · TanStack Query · React Hook Form + Zod · Zustand · Tailwind CSS + custom component library
**Roles:** `GUEST`, `HOTEL_MANAGER` (2 role-based experiences)

**Legend:** `[ ]` not started · `[~]` in progress · `[x]` done & tested

**Status:** Phase 5 — ✅ complete. Polish, responsiveness, a11y & performance pass across the whole app. **Performance:** every route is now a `React.lazy` code-split chunk behind a `Suspense`/`RouteFallback` boundary — the main JS bundle dropped **620 KB → 267 KB** (each page ships its own small chunk, downloaded on navigation) and the build's 500 KB chunk warning is gone; gallery/card images lazy-load. **A11y:** added a keyboard **skip-to-content** link + `<main id="main">` landmark, kept the global brand `:focus-visible` ring, and added a `prefers-reduced-motion` block that neutralizes animations/transitions/smooth-scroll. **UX polish:** `ScrollToTop` resets scroll on navigation; skeleton loaders already cover every async page. **SEO/social:** Open Graph + Twitter card + `theme-color` meta in `index.html`, and per-route document titles via a new `useDocumentTitle` hook (dynamic — e.g. "Stays in Goa · YATRIK", the hotel name on detail). Verified: build + typecheck + lint pass; in-browser check confirmed 15 lazy chunks loading on navigation, correct per-route titles, and the focus-visible skip link. *(This was the last MVP phase — Phases 0–5 all ✅. Remaining work is the post-MVP roadmap in Phase 6: admin role, data-viz dashboards, reviews/wishlist/map, testing, CI/CD, etc.)*

**Prev status (Phase 4 — ✅ complete):** Hotel-manager dashboard built under `features/manager/`: a tabbed **`ManagerLayout`** (`/manager`) wrapping an **Overview** dashboard (`ManagerOverviewPage` — KPI tiles for properties/live/room-types/inventory/nightly-range + a per-hotel table, all aggregated client-side from `/admin/hotels` + rooms via `useQueries`) and **My hotels** (`MyHotelsPage` grid with live/draft badges). Full CRUD: create (`HotelFormPage`) and inline edit (`HotelManagePage`) via a shared **`HotelForm`** (basics, contact, photo/amenity chip lists through `StringListInput`); **room management** (add-room modal `RoomForm` with pricing/inventory/capacity, list + per-room delete); **Publish** (PATCH `/activate`, generates a year of inventory) / **Unpublish** (PUT `active:false`) and a delete-hotel danger zone. New API/hooks/schemas + `StatTile` primitive. Verified: build + typecheck + lint pass; every manager screen (overview, hotels grid, manage page, create form, add-room modal) rendered in-browser via mocked API envelopes. *(Live happy-path against a running backend still not exercisable in the sandbox — backend can't boot here; flows proven with mocked responses. Backend gaps noted: no deactivate endpoint (worked around via PUT) and no bookings/occupancy report endpoint (dashboard aggregates what's available; deep analytics deferred to roadmap 6b). Next: Phase 5 — polish, responsiveness, a11y, performance.)* *(Phases 0–3 also ✅.)*

**Prev status (Phase 3 — ✅ complete):** Guest booking flow & payments built end-to-end under `features/booking/`: an Airbnb-style **guest selector** (adults/children/infants) plus date-range + rooms **stay controls** on the hotel detail page feed each room's **Reserve** into a **checkout** (`/book`) that reserves inventory on mount, collects **guest details** (`GuestDetailsForm`, add/remove rows), shows a transparent **price breakdown** + live **10-min hold countdown** (`BookingSummary`), then chains addGuests → payments → **Stripe redirect**. Added the backend's redirect target **`PaymentStatusPage`** (`/payments/:bookingId/status`, polls `/status` until confirmed/failed/pending) and **`MyBookingsPage`** (`/bookings`) with a manage modal + **cancel/refund** (confirmed-only). New reusable pieces: `GuestSelector`, `GuestDetailsForm`, `BookingSummary`, `BookingStatusBadge`; booking `api.ts`/`hooks.ts`/`schemas.ts`. Verified: build + typecheck + lint pass; checkout, guest-selector modal, My Trips list + detail/cancel modal, and payment-status states all rendered in-browser via mocked API envelopes (desktop). *(Live happy-path against a running backend still not exercisable in the assistant sandbox — backend can't boot here; flows proven with mocked responses. Known backend gap: `BookingDto` carries no hotel/room ref, so My Trips shows booking id/dates/amount rather than the hotel name — a candidate backend enrichment. Next: Phase 4 — hotel manager dashboard.)* *(Phases 0–2 also ✅.)*

---

## How to resume (read this if starting fresh)
This plan is self-contained — a new session needs only this file + `docs/`, no chat history.
1. Read `docs/api-contract.md`, `docs/architecture.md`, `docs/design-system.md`.
2. Implement the lowest phase with unchecked `[ ]` items (or the phase the user named, e.g. `/next phase 0`).
3. Build locally, verify, then tick `[x]` and update the **Status** line above.
4. Stay on branch `feature/frontend`; never push/merge to `master` (user tests first).
5. Honor the decisions at the top (stack, terracotta `#E4572E` + white + teal trust accent, roles, `/frontend` folder).

---

## Phase 0 — Backend Stabilization & Auth  ⛔ blocks everything
*Make the backend compile, run, and authenticate. Without this the frontend cannot log anyone in.*

- [x] Add missing classes: `UnAuthorisedException`, `BookingStatusResponseDto`
- [x] Add `UserRepository` (find by email)
- [x] JWT auth: `JwtService`, `JwtAuthFilter`, `SecurityConfig` (stateless, role-based), `PasswordEncoder` + `UserDetailsServiceImpl`
- [x] `AuthController` + `AuthService`: `POST /auth/signup`, `POST /auth/login`, `GET /auth/me`
- [x] Auth DTOs: `SignupRequest`, `LoginRequest`, `LoginResponse` (token + user + roles), `UserDto`
- [x] `CheckoutService` (Stripe) + `WebhookController` (guarded by config; safe no-op if keys absent)
- [x] Config: `frontend.url`, `stripe.secretKey`, `stripe.webhookSecret` + **CORS** for Vite dev origin (all env-overridable)
- [x] Fix `GET /hotels/search` (GET request body → unusable from browsers): switched to `POST`
- [x] Add read endpoints the UI needs: `GET /bookings` (my bookings), `GET /admin/hotels` (my hotels)
- [x] ~~Note/track~~ **Fixed** known bug: `initialiseBooking` looked up room by `hotelId` → now `roomId` (BookingServiceImpl.java:58). Also fixed proxy-`equals` bug in `cancelBooking`/`getBookingStatus`.
- [x] Verify: full Spring context boots against **real PostgreSQL 18** (`contextLoads`) + MockMvc integration test covers signup→login→me→search + role guards. Swagger endpoints registered. ⚠️ *Live `mvnw spring-boot:run` (embedded Tomcat) can't start inside the assistant's sandbox — its NIO selector needs an AF_UNIX self-pipe the sandbox blocks. Run it in a normal terminal; see `docs/setup.md`. Full Stripe payment needs real keys (dev no-op otherwise).*
- [x] Doc: update `docs/api-contract.md` (+ new `docs/setup.md`)

## Phase 1 — Frontend Foundation & Design System
*Scaffold, tokens, primitives, layout, routing, auth wired end-to-end.*

- [x] Scaffold Vite + React + TS in `/frontend`; **oxlint** (template default) + Prettier; `@/` path alias
- [x] Tailwind v4 + design tokens (orange palette, typography scale, radius, shadows) — `src/styles/globals.css`
- [x] Folder structure (`app/ components/ features/ lib/ stores/ types/ styles/`; `hooks/` added when first needed)
- [x] API client (axios) — unwraps `{data,error}` envelope, JWT interceptor, error normalization (`ApiClientError`), 401 auto-logout
- [x] Core primitives: Button, IconButton, Input, Select, Card, Badge, Modal, Drawer, Skeleton, Spinner, Avatar, Toast (+ Container, EmptyState)
- [x] Layout shell: Navbar (with **YATRIK logo**, auth-aware + mobile drawer), Footer, Container, responsive
- [x] Routing + `ProtectedRoute` + role guard; 404 + route error element
- [x] Auth: Zustand store (persisted token), Login + Signup pages wired to Phase 0 `/auth/*`
- [x] Design & ship the YATRIK logo (location-pin + paper-plane, orange) — `Logo` component + favicon

## Phase 2 — Guest: Browse · Search · Hotel Detail
- [x] Landing/Home: hero search (city, date range, rooms) + "Popular destinations" tiles that deep-link into search. *(Note: backend has no "featured/list-all" endpoint — search requires a city + dates — so destination tiles stand in for "recommended/nearby" until a featured endpoint lands, see roadmap 6b.)*
- [x] Reusable `HotelCard` (photo w/ deterministic fallback, price/night, city+location, favourite toggle, hover lift + image zoom) + `HotelCardSkeleton`
- [x] Search results (`/search`): URL-param driven, responsive grid (1→2→3→4), zero-based `Pagination`, price display, loading (skeletons) / empty / error / "start your search" states
- [x] Hotel detail (`/hotels/:id`): photo mosaic gallery, About + amenities checklist, room list (`RoomCard`, per-room price + Reserve → Phase 3), contact card, reviews placeholder; loading skeleton + not-found state
- [x] Responsive audit: verified home + search states mobile (375) → desktop; search bar & grids reflow, nav collapses to drawer

## Phase 3 — Guest: Booking Flow & Payments
- [x] Guest selector (adults / children / infants) modal — `GuestSelector` steppers on the hotel detail stay controls
- [x] Booking init → add guests form (name, age, gender) — reserve-on-mount + `GuestDetailsForm` (RHF `useFieldArray`, add/remove rows)
- [x] Booking summary + price breakdown — `BookingSummary` (subtotal + dynamic-pricing delta + total from backend) with a live 10-min hold countdown
- [x] Stripe redirect + payment status page (success/failure) with status polling — `PaymentStatusPage` at `/payments/:bookingId/status` (the backend redirect target), polls `/status` until terminal
- [x] My Bookings list + booking detail + cancel (with refund) flow — `MyBookingsPage` at `/bookings` with a manage modal; cancel enabled only for `CONFIRMED`

## Phase 4 — Hotel Manager Dashboard
- [x] Manager layout & navigation — `ManagerLayout` with tabbed sub-nav (Overview / My hotels) under `/manager`
- [x] My Hotels list; create/edit hotel (photos, amenities, contact info) — `MyHotelsPage` grid + `HotelForm` (create page + inline edit on manage page), `StringListInput` chips for photos/amenities
- [x] Room management: create/list/delete, pricing, capacity/inventory — `RoomForm` (add-room modal), room list with per-room delete on `HotelManagePage`
- [x] Activate / deactivate hotel — Publish (PATCH `/activate`, generates a year of inventory) / Unpublish (PUT `active:false`, the only deactivate path the backend exposes)
- [x] Bookings / occupancy overview — `ManagerOverviewPage` KPI tiles + per-hotel table aggregated client-side from `/admin/hotels` + rooms *(booking-level occupancy/revenue still needs a backend report endpoint — deferred to roadmap 6b, with an honest placeholder panel)*

## Phase 5 — Polish · Responsiveness · A11y · Performance
- [x] Micro-interactions (hover, focus, transitions), skeleton loaders everywhere — primitives already animate; added `prefers-reduced-motion` to neutralize motion for those who ask; skeletons cover every async page (search, detail, checkout, trips, manager)
- [x] Full responsive + keyboard-a11y audit; visible focus states — global `:focus-visible` brand ring (already present), a **skip-to-content** link + `<main id="main">` landmark, `RouteFallback` with `role=status`; grids/nav verified reflowing across phases
- [x] Performance: route-based code splitting, lazy images, prefetch — every page is a `React.lazy` chunk behind Suspense (**main bundle 620 KB → 267 KB**, 500 KB warning gone); gallery/cards lazy-load images
- [x] Meta/SEO basics, favicon, social preview; empty & error illustrations — Open Graph + Twitter + `theme-color` meta in `index.html`; per-route document titles via `useDocumentTitle` (dynamic for city/hotel); favicon already shipped; `EmptyState` (icon + message + action) used across all empty/error states

## Phase 6 — Roadmap (post-MVP, interview value-adds)
*Pick per priority; each is its own mini-plan when we get there.*

### 6a — Admin role (3rd role: platform operator)
- [ ] Backend: add `ADMIN` to role set; secure `/admin/**` platform endpoints; keep role checks extensible
- [ ] Hotel/listing approval workflow (verify before a manager's hotel goes live)
- [ ] Moderate users & listings (suspend/ban, take down fraudulent listings)
- [ ] Manual dispute handling / refund override

### 6b — Creative dashboards (data viz, per role)
- [ ] **Admin dashboard:** platform KPIs — total revenue, bookings, active hotels, occupancy, growth trends; charts (revenue over time, top cities/hotels, booking funnel), recent activity feed
- [ ] **Manager dashboard:** per-hotel occupancy heatmap/calendar, revenue & ADR, upcoming check-ins, booking status breakdown
- [ ] **Guest dashboard/profile:** trips timeline, upcoming & past stays, spend summary, saved/wishlist
- [ ] Reusable chart components (line/bar/donut/stat-tile/KPI row), light+dark, responsive
- [ ] Backend: aggregate/report endpoints to feed the dashboards

### 6c — Other value-adds
- [ ] Reviews & ratings (backend + UI)
- [ ] Wishlist / favourites
- [ ] Map view (Explore) for search
- [ ] Search filters (price range, amenities, rating)
- [ ] Image upload (S3/Cloudinary) instead of URL strings
- [ ] Refresh tokens + silent refresh; rate limiting
- [ ] Testing: Vitest + React Testing Library + Playwright E2E
- [ ] Storybook for the component library
- [ ] CI/CD + Dockerize (frontend + backend + db) with compose
- [ ] i18n + multi-currency

---

## Change log
- **2026-09-03 — Phase 5 complete.** Polish / responsiveness / a11y / performance pass.
  **Code splitting:** rewrote `app/router.tsx` so every page is a `React.lazy` chunk behind a
  shared `Suspense` + new `RouteFallback` spinner — main bundle 620 KB → 267 KB, per-page chunks,
  500 KB build warning cleared. **A11y:** `AppLayout` gained a skip-to-content link and a
  `<main id="main">` landmark; `globals.css` gained a `prefers-reduced-motion` block (kills
  animations/transitions/smooth-scroll for those who opt out); the global brand focus ring stays.
  **UX:** new `ScrollToTop` resets scroll on route change. **SEO/social:** `index.html` gained
  Open Graph, Twitter-card and `theme-color` meta; new `useDocumentTitle` hook sets per-route
  titles (dynamic for the searched city and hotel name) and is wired into every page. Verified
  build + typecheck + lint and confirmed in-browser: 15 lazy chunks load across navigation,
  titles update per route, the skip link is keyboard-focusable. Closes the MVP (Phases 0–5).
- **2026-09-03 — Phase 4 complete.** Built the hotel-manager dashboard as a new
  `features/manager/` slice (`api.ts`, `hooks.ts`, `schemas.ts`) over the existing `/admin/hotels`
  endpoints. Added a tabbed **`ManagerLayout`** (`/manager`) with an **Overview** dashboard
  (`ManagerOverviewPage`: KPI `StatTile`s + a per-hotel table, aggregated client-side from the
  hotels list and per-hotel room queries) and a **My hotels** grid (`MyHotelsPage`, live/draft
  badges). Full hotel CRUD via a shared **`HotelForm`** — create (`HotelFormPage`, `/manager/hotels/new`)
  and inline edit (`HotelManagePage`, `/manager/hotels/:id`) — with a reusable **`StringListInput`**
  chip editor for photo URLs and amenities. **Room management** on the manage page: an add-room
  modal (`RoomForm`: type, price, inventory, capacity, amenities, photos), a room list, and
  per-room delete (confirm modal). **Publish** uses PATCH `/activate` (generates a year of
  inventory); **Unpublish** uses PUT with `active:false` (the backend has no dedicated deactivate
  route). A danger-zone delete removes the hotel. Verified build + typecheck + lint, and rendered
  every screen in-browser against mocked `{data,error}` envelopes. Backend gaps recorded: no
  deactivate endpoint (worked around) and no bookings/occupancy report endpoint (overview shows
  available portfolio data; deep analytics deferred to roadmap 6b).
- **2026-09-03 — Phase 3 complete.** Built the guest booking flow & payments as a new
  `features/booking/` slice (`api.ts`, `hooks.ts`, `schemas.ts`). The hotel detail page gained
  **stay controls** (date-range picker + rooms select + an Airbnb-style **`GuestSelector`**
  adults/children/infants modal); each room's **Reserve** now carries dates + occupancy into a
  **`BookingCheckoutPage`** (`/book`). Checkout reserves inventory on mount (`POST /bookings/init`,
  guarded against StrictMode double-fire), then renders **`GuestDetailsForm`** (RHF `useFieldArray`,
  add/remove name·age·gender rows) beside a **`BookingSummary`** with a transparent price breakdown
  (base × nights × rooms + dynamic-pricing delta = backend total) and a live **10-minute hold
  countdown**; submit chains `addGuests` → `payments` → hands the browser to the returned Stripe
  (or dev no-op) URL. Added **`PaymentStatusPage`** at `/payments/:bookingId/status` — the exact URL
  the backend redirects to — which polls `GET /bookings/{id}/status` until it settles into
  confirmed / failed / still-processing. Added **`MyBookingsPage`** (`/bookings`, replacing the
  placeholder): a trips list with `BookingStatusBadge`s and a manage modal showing guests + a
  **cancel (refund)** action enabled only for `CONFIRMED` bookings. Verified build + typecheck +
  lint, and rendered every new screen in-browser against mocked `{data,error}` envelopes. Noted a
  backend gap: `BookingDto` has no hotel/room reference, so My Trips can't show the hotel name yet.
- **2026-08-31 — Phase 2 complete.** Built the guest browse experience: a reusable `SearchBar`
  (city + native date range + rooms, RHF+Zod), a redesigned Home with the hero search + "Popular
  destinations" tiles, `SearchResultsPage` (`/search`, URL-param driven with pagination and
  loading/empty/error/no-query states), and `HotelDetailPage` (`/hotels/:id`, photo-mosaic gallery,
  amenities checklist, `RoomCard` list with per-room price + Reserve→Phase 3, contact card, reviews
  placeholder). Added shared primitives `Rating`, `PriceTag`, `Pagination`, and `lib/format.ts`
  (currency/date helpers). `Reserve` and the favourite toggle are wired but defer their real
  behavior to Phase 3 / roadmap. Verified build + typecheck + lint; validated routing, prefill,
  validation, and async states in-browser (desktop + mobile). Constraint noted: no featured/list-all
  endpoint exists, so "recommended/nearby" is served by destination tiles for now.
- **2026-08-31 — Phase 2 UI refinement.** Per review: made the app curvier (pill buttons/inputs/
  selects, `rounded-full` search bar on desktop, `rounded-2xl` cards; bumped radius tokens) and
  replaced external `picsum.photos` images with **bundled local SVG artwork** — one branded tile per
  destination (`public/destinations/`) + a hotel photo placeholder (`public/placeholder-hotel.svg`),
  with an `onError` fallback on all images. App is now offline-safe with no external image hosts.
  Rebuilt the search bar as an **Airbnb-style pill** (borderless segments + dividers, circular
  icon-only search button, noticeable hover). Added a **custom `DateRangePicker`** — dependency-free
  dual-month range calendar with hover-preview selection and quick-duration chips (This weekend /
  1 week / 1 month); the whole Check-in/Check-out tab opens it (not just the icon).
- **2026-08-31 — Phase 1 complete.** Scaffolded the `/frontend` app (React 19, Vite 8, TS 6,
  Tailwind v4, React Router 7, TanStack Query 5, Zustand, React Hook Form + Zod, axios). Built the
  design system (orange tokens + Inter), the primitive library, the layout shell (auth-aware Navbar
  with logo + mobile drawer, Footer), routing with `ProtectedRoute`/role guards + error/404, the
  axios envelope-unwrapping API client, the persisted auth store, and the Login/Signup pages wired
  to the Phase 0 auth endpoints. Designed & shipped the YATRIK logo. Verified: `build`, `typecheck`,
  `lint` all pass; pages render and form validation works in-browser. Tooling note: template ships
  **oxlint** (used instead of ESLint) + Prettier.
- **2026-08-31 — Phase 0 complete.** Backend now compiles & authenticates. Added JWT auth
  (service/filter/security config/user-details), `AuthController`+`AuthService`, auth DTOs, Stripe
  `CheckoutService` + `WebhookController` (both safe no-ops without keys), env-overridable config +
  CORS. Fixed the search GET-body bug (→POST), the `initialiseBooking` room-lookup bug, and a
  proxy-`equals` ownership-check bug. Added `GET /bookings` and `GET /admin/hotels`. Verified against
  real PostgreSQL 18 (context load + MockMvc integration test). Added `docs/setup.md`.
