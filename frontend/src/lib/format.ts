/** Formatting helpers shared across the app. */

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

/** Format a price as Indian rupees, e.g. `4200` → `₹4,200`. */
export function formatCurrency(amount: number): string {
  return currency.format(Math.round(amount))
}

const shortDate = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' })
const shortDateYear = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

/** Parse a `yyyy-MM-dd` string into a local Date (avoids UTC off-by-one). */
export function parseDate(value: string): Date {
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

/** `2026-09-01` → `1 Sep`; with a year when it differs from now. */
export function formatDate(value: string, withYear = false): string {
  const date = parseDate(value)
  return (withYear ? shortDateYear : shortDate).format(date)
}

/** `2026-09-01`, `2026-09-04` → `1 Sep – 4 Sep`. */
export function formatDateRange(start: string, end: string): string {
  return `${formatDate(start)} – ${formatDate(end)}`
}

/** Whole nights between two `yyyy-MM-dd` dates (min 0). */
export function nightsBetween(start: string, end: string): number {
  const ms = parseDate(end).getTime() - parseDate(start).getTime()
  return Math.max(0, Math.round(ms / 86_400_000))
}

/** Today as `yyyy-MM-dd` (local). */
export function todayIso(): string {
  return toIso(new Date())
}

/** Add `days` to a `yyyy-MM-dd` string, returning `yyyy-MM-dd`. */
export function addDays(value: string, days: number): string {
  const d = parseDate(value)
  d.setDate(d.getDate() + days)
  return toIso(d)
}

/** Serialize a local `Date` to `yyyy-MM-dd` (no UTC shift). */
export function toIso(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
