# Design System — YATRIK

**Brand:** *Yatrik* = traveler. Warm, welcoming, trustworthy — *a safe place that feels like home*.
Clean & simple like Airbnb, but **terracotta** (warm, earthy, homey) where Airbnb is pink. White
canvas, generous whitespace, soft shadows, rounded corners.

## Logo
Wordmark **"yatrik"** (lowercase, friendly geometric sans, near-black) + a mark: a **location pin
holding a home** — "a safe place, found on the map" (travel + belonging). Mark in brand terracotta;
works on white and reversed on terracotta. Shipped as `components/brand/Logo.tsx` (`reversed`/`markOnly`
props) + `public/logo-mark.svg` (favicon).

## Color tokens
Primary = terracotta; neutrals lean warm-gray. WCAG AA for text on background.

| Token | Hex | Use |
|-------|-----|-----|
| `primary-50` | `#FDF4F1` | tint backgrounds, hover fills |
| `primary-100` | `#FBE3DB` | subtle highlights |
| `primary-300` | `#EFA48C` | disabled/soft accents |
| `primary-500` | `#E4572E` | **primary brand** (buttons, links, active) |
| `primary-600` | `#CB4522` | hover / pressed |
| `primary-700` | `#A6371B` | text on light, emphasis |
| `ink-900` | `#1A1A1A` | primary text |
| `ink-700` | `#3D3D3D` | body text |
| `ink-500` | `#6B6B6B` | secondary text |
| `ink-300` | `#B8B8B8` | placeholder, borders-strong |
| `line` | `#EBEBEB` | borders, dividers |
| `surface` | `#FFFFFF` | cards, canvas |
| `bg` | `#FAFAFA` | app background |
| `success` | `#1FA97A` · `danger` | `#E5484D` · `warning` | `#F5A623` |
| `star` | `#E4572E` | ratings (brand terracotta) |
| `trust-500` | `#0F9E8E` | **trust accent (teal)** — verified, secure checkout, safety cues |
| `trust-600` | `#0F766E` | trust accent, hover/text |

**Palette intent:** orange to *welcome* (primary/CTAs), teal to *reassure* (trust/verified/secure),
ink to feel *stable* (text). Use `Badge tone="trust"` for verified/secure labels.

## Typography
- **Font:** Inter (UI) — system-ui fallback. Optional display font for hero later.
- **Scale (rem):** xs .75 · sm .875 · base 1 · lg 1.125 · xl 1.25 · 2xl 1.5 · 3xl 1.875 · 4xl 2.25 · 5xl 3
- Headings: 600–700 weight, tight tracking. Body: 400–500, `ink-700`, line-height 1.5–1.6.

## Spacing / radius / shadow
- Spacing scale: 4px base (Tailwind default 1=4px). Section gutters 16/24/32/48.
- Radius — **YATRIK leans curvy/soft** (friendly, homey): `sm` 10 · `md` 14 · `lg` 20 · `xl` 26 ·
  `2xl` 30 · `3xl` 36 · `full` pills. **Buttons, inputs & selects are fully rounded (`rounded-full`
  pills); cards/tiles/gallery use `rounded-2xl`.** The hero/search bar is a pill: `rounded-3xl` on
  mobile → `rounded-full` (stadium) on `md+`.
- Shadow: `sm` cards at rest · `md` on hover (lift) · `lg` modals/popovers. Subtle, never harsh.

## Imagery
- **Location tiles:** bundled brand-tinted SVG artwork in `public/destinations/*.svg` (one per city:
  gradient sky + sun + a simple landmark silhouette + layered hills). Self-contained — always load,
  no external CDN. Swap for real photos later by replacing the file.
- **Hotel photo fallback:** `public/placeholder-hotel.svg` (terracotta house-on-a-hill) is used when a
  hotel/room has no `photos[]`, and as the `onError` fallback for broken image URLs.
- No external image hosts (removed `picsum.photos`) — keeps the app offline-safe and dependency-free.

## Interaction detailing
- Buttons: 150ms ease transitions; hover darkens to `primary-600`, active scale 0.98, clear focus ring (`primary-500` @ 40% + offset).
- Cards: hover raises shadow + tiny translateY(-2px); image zoom 1.03 on hover.
- Inputs: 1px `line` border → `primary-500` on focus with soft ring; inline validation text in `danger`.
- Loading: skeletons (not spinners) for lists/cards; spinner only for button/inline actions.
- Empty/Error states: illustration + one-line message + primary action.

## Responsive breakpoints (Tailwind)
`sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`. Mobile-first. Targets: phone, tablet, laptop, monitor.
- Grids: 1 col (mobile) → 2 (sm) → 3 (lg) → 4 (xl) for hotel cards.
- Navbar collapses to a compact search + menu drawer on mobile.

## Component inventory
**Phase 1 primitives (`components/ui`):** Button · IconButton · Input · Select · Card · Badge ·
Avatar · Modal · Drawer · Toast · Skeleton · Spinner · EmptyState · Container. Layout: Navbar ·
Footer.
**Phase 2 additions (`components/ui`):** Rating · PriceTag · Pagination.
**Phase 2 feature components (`features/hotels`):** SearchBar · **DateRangePicker** · HotelCard ·
HotelCardSkeleton · HotelGallery · RoomCard.

> **DateRangePicker** is a custom, dependency-free range calendar (dual-month, hover-preview range
> selection, quick-duration chips — This weekend / 1 week / 1 month, outside-click/Esc to close).
> It renders the Check-in/Check-out pill segments and emits `yyyy-MM-dd` strings into the form.
> Rooms uses a borderless native `Select`. A `GuestCounterPopover` (per-guest adults/children counts)
> is a Phase 3 item for the booking flow.
