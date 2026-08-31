---
description: Implement the next (or a specified) phase of the YATRIK frontend plan
---

You are resuming the YATRIK frontend project in a fresh context. Do this in order:

1. Read `plans/frontend-plan.md` fully (the phased plan + working agreement + decisions).
2. Read `docs/README.md`, `docs/api-contract.md`, `docs/architecture.md`, `docs/design-system.md`.
3. Determine the target phase:
   - If the user passed one in `$ARGUMENTS` (e.g. "phase 0", "0", "2"), use that phase.
   - Otherwise, implement the lowest-numbered phase that still has unchecked `[ ]` items.
4. Confirm the plan of attack for that phase in 3-5 bullets, then implement it.
5. As each checklist item is completed **and locally verified**, edit `plans/frontend-plan.md`
   to change its `[ ]` to `[x]`, and update the `**Status:**` line at the top.
6. Keep docs in `docs/` current (concise) when contracts or structure change.
7. Do NOT push or merge to `master` — the user tests locally first. Work stays on `feature/frontend`.

Honor all decisions recorded in the plan (stack, orange `#FF6A2C` + white, roles, folder structure).
If something is genuinely ambiguous and blocks progress, ask; otherwise proceed with sensible defaults.

Target phase from user: $ARGUMENTS
