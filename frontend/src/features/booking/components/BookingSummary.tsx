import type { ReactNode } from 'react'
import { formatCurrency, formatDateRange, nightsBetween } from '@/lib/format'
import type { Hotel, Room } from '@/types/api'

interface BookingSummaryProps {
  hotel: Hotel
  room: Room
  checkInDate: string
  checkOutDate: string
  roomsCount: number
  occupancy: string
  /** Final priced total from the backend (dynamic pricing). */
  amount: number
  /** Optional slot under the price (e.g. an expiry countdown). */
  footer?: ReactNode
}

const PLACEHOLDER = '/placeholder-hotel.svg'

/** Right-rail order summary: stay details + a transparent price breakdown. */
export function BookingSummary({
  hotel,
  room,
  checkInDate,
  checkOutDate,
  roomsCount,
  occupancy,
  amount,
  footer,
}: BookingSummaryProps) {
  const nights = nightsBetween(checkInDate, checkOutDate)
  const subtotal = room.basePrice * nights * roomsCount
  const adjustment = amount - subtotal
  const photo = hotel.photos?.[0] || PLACEHOLDER

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
      <div className="flex gap-3 border-b border-line pb-4">
        <img
          src={photo}
          alt={hotel.name}
          onError={(e) => {
            e.currentTarget.src = PLACEHOLDER
          }}
          className="h-16 w-16 shrink-0 rounded-lg object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-xs font-medium uppercase tracking-wide text-ink-500">
            {hotel.city}
          </p>
          <h3 className="truncate font-bold text-ink-900">{hotel.name}</h3>
          <p className="truncate text-sm text-ink-500">{room.type}</p>
        </div>
      </div>

      <dl className="space-y-2 border-b border-line py-4 text-sm">
        <Row label="Dates">{formatDateRange(checkInDate, checkOutDate)}</Row>
        <Row label="Guests">{occupancy}</Row>
        <Row label="Rooms">
          {roomsCount} room{roomsCount === 1 ? '' : 's'} · {nights} night
          {nights === 1 ? '' : 's'}
        </Row>
      </dl>

      <dl className="space-y-2 py-4 text-sm">
        <Row label={`${formatCurrency(room.basePrice)} × ${nights} night${nights === 1 ? '' : 's'} × ${roomsCount} room${roomsCount === 1 ? '' : 's'}`}>
          {formatCurrency(subtotal)}
        </Row>
        {adjustment !== 0 && (
          <Row label={adjustment > 0 ? 'Dynamic pricing & fees' : 'Savings'}>
            <span className={adjustment > 0 ? 'text-ink-700' : 'text-success'}>
              {adjustment > 0 ? '+' : '−'}
              {formatCurrency(Math.abs(adjustment))}
            </span>
          </Row>
        )}
      </dl>

      <div className="flex items-baseline justify-between border-t border-line pt-4">
        <span className="font-bold text-ink-900">Total</span>
        <span className="text-xl font-bold text-ink-900">{formatCurrency(amount)}</span>
      </div>

      {footer && <div className="mt-4">{footer}</div>}
    </div>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-ink-500">{label}</dt>
      <dd className="text-right font-medium text-ink-900">{children}</dd>
    </div>
  )
}
