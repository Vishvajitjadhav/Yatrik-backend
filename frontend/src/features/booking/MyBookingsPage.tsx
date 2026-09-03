import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
  Container,
  EmptyState,
  Modal,
  PriceTag,
  Skeleton,
} from '@/components/ui'
import { toast } from '@/stores/toastStore'
import { formatDate, formatDateRange, nightsBetween } from '@/lib/format'
import type { Booking } from '@/types/api'
import { BookingStatusBadge } from './components/BookingStatusBadge'
import { useBookingStatus, useCancelBooking, useMyBookings } from './hooks'

export function MyBookingsPage() {
  const { data, isLoading, isError, refetch } = useMyBookings()
  const [selected, setSelected] = useState<Booking | null>(null)

  if (isLoading) {
    return (
      <Container className="py-8">
        <h1 className="mb-6 text-2xl font-bold text-ink-900 sm:text-3xl">My trips</h1>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      </Container>
    )
  }

  if (isError) {
    return (
      <Container className="py-16">
        <EmptyState
          title="Couldn’t load your trips"
          message="Something went wrong reaching the server. Please try again."
          action={<Button onClick={() => refetch()}>Retry</Button>}
        />
      </Container>
    )
  }

  const bookings = data ?? []

  return (
    <Container className="py-8">
      <h1 className="mb-6 text-2xl font-bold text-ink-900 sm:text-3xl">My trips</h1>

      {bookings.length === 0 ? (
        <EmptyState
          icon={<SuitcaseIcon />}
          title="No trips yet"
          message="Your booked stays will show up here. Ready to plan your next escape?"
          action={
            <Link to="/search">
              <Button>Find a stay</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <BookingRow key={b.id} booking={b} onOpen={() => setSelected(b)} />
          ))}
        </div>
      )}

      <BookingDetailModal booking={selected} onClose={() => setSelected(null)} />
    </Container>
  )
}

function BookingRow({ booking, onOpen }: { booking: Booking; onOpen: () => void }) {
  const nights = nightsBetween(booking.checkInDate, booking.checkOutDate)
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-base font-bold text-ink-900">Booking #{booking.id}</h2>
          <BookingStatusBadge status={booking.bookingStatus} />
        </div>
        <p className="mt-1 text-sm text-ink-700">
          {formatDateRange(booking.checkInDate, booking.checkOutDate)} · {nights} night
          {nights === 1 ? '' : 's'} · {booking.roomsCount} room{booking.roomsCount === 1 ? '' : 's'}
        </p>
        <p className="mt-0.5 text-sm text-ink-500">
          {booking.guests?.length ?? 0} guest{(booking.guests?.length ?? 0) === 1 ? '' : 's'} ·
          Booked {formatDate(booking.createdAt.slice(0, 10), true)}
        </p>
      </div>
      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
        <PriceTag amount={Number(booking.amount)} />
        <Button size="sm" variant="outline" onClick={onOpen} className="whitespace-nowrap">
          View details
        </Button>
      </div>
    </div>
  )
}

function BookingDetailModal({
  booking,
  onClose,
}: {
  booking: Booking | null
  onClose: () => void
}) {
  const open = booking != null
  // Live status while the modal is open (falls back to the list's snapshot).
  const { data: live } = useBookingStatus(booking?.id, open)
  const cancel = useCancelBooking()

  if (!booking) return null

  const status = live?.bookingStatus ?? booking.bookingStatus
  const nights = nightsBetween(booking.checkInDate, booking.checkOutDate)
  const canCancel = status === 'CONFIRMED'

  const handleCancel = () => {
    cancel.mutate(booking.id, {
      onSuccess: () => {
        toast.success('Booking cancelled. Any payment will be refunded.')
        onClose()
      },
      onError: (err) => toast.error((err as Error).message),
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Booking #${booking.id}`}
      footer={
        canCancel ? (
          <>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
            <Button variant="danger" isLoading={cancel.isPending} onClick={handleCancel}>
              Cancel booking
            </Button>
          </>
        ) : (
          <Button onClick={onClose}>Close</Button>
        )
      }
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <BookingStatusBadge status={status} />
          <PriceTag amount={Number(booking.amount)} />
        </div>

        <dl className="space-y-2 rounded-xl bg-bg p-4 text-sm">
          <Row label="Check-in">{formatDate(booking.checkInDate, true)}</Row>
          <Row label="Check-out">{formatDate(booking.checkOutDate, true)}</Row>
          <Row label="Nights">{nights}</Row>
          <Row label="Rooms">{booking.roomsCount}</Row>
        </dl>

        <div>
          <h3 className="mb-2 text-sm font-bold text-ink-900">
            Guests ({booking.guests?.length ?? 0})
          </h3>
          {booking.guests && booking.guests.length > 0 ? (
            <ul className="divide-y divide-line rounded-xl border border-line">
              {booking.guests.map((g, i) => (
                <li key={g.id ?? i} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <span className="font-medium text-ink-900">{g.name}</span>
                  <span className="text-ink-500">
                    {g.gender.charAt(0) + g.gender.slice(1).toLowerCase()} · {g.age} yrs
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-500">No guests were added to this booking.</p>
          )}
        </div>

        {canCancel && (
          <p className="text-sm text-ink-500">
            Cancelling a confirmed booking releases your rooms and refunds your payment.
          </p>
        )}
      </div>
    </Modal>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink-500">{label}</dt>
      <dd className="font-medium text-ink-900">{children}</dd>
    </div>
  )
}

function SuitcaseIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M8 7v13M16 7v13" />
    </svg>
  )
}
