# YATRIK — Project Guide for Claude

Airbnb-inspired hotel booking platform. **Spring Boot backend** (existing) + **React frontend** (in progress).

## Start here every session
- **Plan (source of truth):** [plans/frontend-plan.md](plans/frontend-plan.md) — phased, with progress checkboxes.
- **Docs:** [docs/](docs/README.md) — [api-contract](docs/api-contract.md), [architecture](docs/architecture.md), [design-system](docs/design-system.md).
- **Resume work:** run `/next` (implements the next unchecked phase) or `/next phase 0`.

## Fixed decisions (do not re-litigate)
- Frontend: **React + Vite + TypeScript**, React Router, TanStack Query, React Hook Form + Zod, Zustand. Lives in `/frontend`.
- Styling: **Tailwind + custom component library**. Primary **terracotta `#E4572E`** + white, Airbnb-clean; **teal `#0F766E`** trust accent.
- Roles: `GUEST` (the app user/traveler) + `HOTEL_MANAGER` now; `ADMIN` planned in Phase 6.
- App name **YATRIK** = traveler.

## Ground rules
- Work on branch `feature/frontend`. **Never push/merge to `master`** — the user tests locally first.
- When a checklist item is done & locally verified, tick its box in the plan and update the `**Status:**` line.
- Keep docs concise and current. Follow clean OOP, readable code, good folder structure; comment only where it matters.

## Backend quick facts
- Java 21, Spring Boot, PostgreSQL, JWT, Stripe. Base path `/api/v1`. Responses wrapped as `{ timeStamp, data, error }`.
- ⚠️ The committed backend is incomplete (no working auth, won't compile). **Phase 0** fixes this before frontend work — details in the plan.
