# YATRIK — Frontend

React SPA for the YATRIK hotel-booking platform. Talks to the Spring Boot backend at `/api/v1`.

**Stack:** React 19 · Vite 8 · TypeScript 6 · Tailwind CSS v4 · React Router 7 ·
TanStack Query 5 · Zustand · React Hook Form + Zod · axios. Lint: oxlint · Format: Prettier.

## Develop
```bash
npm install
npm run dev        # http://localhost:5173  (proxies /api → http://localhost:8080)
```
Start the backend too (see [../docs/setup.md](../docs/setup.md)) so auth and data work.

## Scripts
| Script | What |
|--------|------|
| `npm run dev` | Vite dev server (HMR) |
| `npm run build` | Typecheck (`tsc -b`) + production build |
| `npm run typecheck` | Types only |
| `npm run lint` | oxlint |
| `npm run format` | Prettier write |

## Layout
See [../docs/architecture.md](../docs/architecture.md) for the folder structure. Design tokens and the
component inventory live in [../docs/design-system.md](../docs/design-system.md); the API contract is in
[../docs/api-contract.md](../docs/api-contract.md).

## Config
`VITE_API_BASE_URL` (default `/api/v1`) overrides the backend base path.
