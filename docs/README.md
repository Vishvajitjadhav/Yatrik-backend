# YATRIK — Documentation

Short, living docs. Keep entries concise; link out rather than duplicate.

| Doc | What's inside |
|-----|---------------|
| [setup.md](setup.md) | Local environment setup: versions, PostgreSQL, env vars, run + smoke test |
| [architecture.md](architecture.md) | System overview, layers, frontend architecture & tech decisions |
| [api-contract.md](api-contract.md) | Every endpoint the frontend uses: method, path, request, response |
| [design-system.md](design-system.md) | Brand, color tokens, typography, spacing, component inventory |
| [../plans/frontend-plan.md](../plans/frontend-plan.md) | Phased delivery plan with progress checkboxes |

**Conventions**
- Base API path: `/api/v1`
- All API responses are wrapped: `{ timeStamp, data, error }`
- Roles: `GUEST`, `HOTEL_MANAGER`
