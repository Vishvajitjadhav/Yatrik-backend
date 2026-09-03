import { Badge, type BadgeTone } from '@/components/ui'
import type { BookingStatus } from '@/types/api'

const MAP: Record<BookingStatus, { tone: BadgeTone; label: string }> = {
  RESERVED: { tone: 'warning', label: 'Reserved' },
  GUEST_ADDED: { tone: 'warning', label: 'Guests added' },
  PAYMENTS_PENDING: { tone: 'warning', label: 'Payment pending' },
  CONFIRMED: { tone: 'success', label: 'Confirmed' },
  CANCELLED: { tone: 'danger', label: 'Cancelled' },
  EXPIRED: { tone: 'neutral', label: 'Expired' },
}

/** Coloured pill for a booking's lifecycle status. */
export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const { tone, label } = MAP[status]
  return <Badge tone={tone}>{label}</Badge>
}
