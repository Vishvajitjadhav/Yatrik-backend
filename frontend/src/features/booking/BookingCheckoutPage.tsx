import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Container, EmptyState, Skeleton } from '@/components/ui'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { toast } from '@/stores/toastStore'
import { useHotelInfo } from '@/features/hotels/hooks'
import type { Booking } from '@/types/api'
import { GuestDetailsForm } from './components/GuestDetailsForm'
import { BookingSummary } from './components/BookingSummary'
import { useAddGuests, useInitBooking, useInitiatePayment } from './hooks'
import { guestHeadcount, occupancyLabel, type Occupancy } from './schemas'
import type { GuestPayload } from './api'

/** Reads the reservation intent from the URL (set by the hotel detail page). */
function useCheckoutParams() {
  const [params] = useSearchParams()
  const num = (k: string) => Number(params.get(k))
  const hotelId = num('hotelId')
  const roomId = num('roomId')
  const checkInDate = params.get('checkIn') ?? ''
  const checkOutDate = params.get('checkOut') ?? ''
  const roomsCount = Math.max(1, num('rooms') || 1)
  const occupancy: Occupancy = {
    adults: Math.max(1, num('adults') || 1),
    children: Math.max(0, num('children') || 0),
    infants: Math.max(0, num('infants') || 0),
  }
  const valid =
    Number.isFinite(hotelId) &&
    hotelId > 0 &&
    Number.isFinite(roomId) &&
    roomId > 0 &&
    checkInDate < checkOutDate &&
    Boolean(checkInDate && checkOutDate)
  return { hotelId, roomId, checkInDate, checkOutDate, roomsCount, occupancy, valid }
}

export function BookingCheckoutPage() {
  useDocumentTitle('Confirm and pay')
  const p = useCheckoutParams()
  const navigate = useNavigate()

  const info = useHotelInfo(p.valid ? p.hotelId : undefined)
  const initBooking = useInitBooking()
  const addGuests = useAddGuests()
  const initiatePayment = useInitiatePayment()

  const [booking, setBooking] = useState<Booking | null>(null)
  const [redirecting, setRedirecting] = useState(false)
  const initOnce = useRef(false)

  // Reserve inventory once, as soon as the page mounts with valid params.
  useEffect(() => {
    if (!p.valid || initOnce.current) return
    initOnce.current = true
    initBooking.mutate(
      {
        hotelId: p.hotelId,
        roomId: p.roomId,
        checkInDate: p.checkInDate,
        checkOutDate: p.checkOutDate,
        roomsCount: p.roomsCount,
      },
      { onSuccess: setBooking },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!p.valid) {
    return (
      <Container className="py-16">
        <EmptyState
          title="Missing booking details"
          message="We couldn’t start this reservation. Please pick a stay, dates and guests again."
          action={
            <Link to="/search">
              <Button>Back to search</Button>
            </Link>
          }
        />
      </Container>
    )
  }

  const room = info.data?.rooms.find((r) => r.id === p.roomId)
  const backToHotel = `/hotels/${p.hotelId}`

  // Reserving / loading hotel details.
  if (initBooking.isPending || info.isLoading || (!booking && !initBooking.isError)) {
    return <CheckoutSkeleton />
  }

  if (initBooking.isError || !booking) {
    return (
      <Container className="py-16">
        <EmptyState
          title="Couldn’t reserve this room"
          message={
            (initBooking.error as Error | undefined)?.message ??
            'These rooms may no longer be available for your dates. Try different dates.'
          }
          action={
            <Link to={backToHotel}>
              <Button>Back to hotel</Button>
            </Link>
          }
        />
      </Container>
    )
  }

  if (info.isError || !room) {
    return (
      <Container className="py-16">
        <EmptyState
          title="Room details unavailable"
          message="We reserved your room but couldn’t load its details. Please head back and try again."
          action={
            <Link to={backToHotel}>
              <Button>Back to hotel</Button>
            </Link>
          }
        />
      </Container>
    )
  }

  const { hotel } = info.data!

  const handleGuests = (guests: GuestPayload[]) => {
    addGuests.mutate(
      { bookingId: booking.id, guests },
      {
        onSuccess: () => {
          initiatePayment.mutate(booking.id, {
            onSuccess: ({ sessionUrl }) => {
              setRedirecting(true)
              // Dev no-op returns our own /payments/:id/status URL; Stripe returns
              // its hosted checkout. Either way, hand the browser off.
              window.location.href = sessionUrl
            },
            onError: (err) => toast.error((err as Error).message),
          })
        },
        onError: (err) => toast.error((err as Error).message),
      },
    )
  }

  const busy = addGuests.isPending || initiatePayment.isPending || redirecting

  return (
    <Container className="py-6 sm:py-8">
      <button
        onClick={() => navigate(backToHotel)}
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-ink-500 hover:text-ink-900"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back
      </button>

      <h1 className="text-2xl font-bold text-ink-900 sm:text-3xl">Confirm and pay</h1>
      <p className="mt-1 text-ink-500">
        Add your guest details, then continue to secure payment.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <h2 className="mb-4 text-xl font-bold text-ink-900">Guest details</h2>
          <GuestDetailsForm
            initialCount={guestHeadcount(p.occupancy)}
            submitting={busy}
            onSubmit={handleGuests}
          />
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BookingSummary
            hotel={hotel}
            room={room}
            checkInDate={p.checkInDate}
            checkOutDate={p.checkOutDate}
            roomsCount={p.roomsCount}
            occupancy={occupancyLabel(p.occupancy)}
            amount={Number(booking.amount)}
            footer={<ExpiryNotice createdAt={booking.createdAt} />}
          />
        </aside>
      </div>
    </Container>
  )
}

/** Counts down the 10-minute reservation hold from the booking's creation time. */
function ExpiryNotice({ createdAt }: { createdAt: string }) {
  const deadline = new Date(createdAt).getTime() + 10 * 60 * 1000
  const [remaining, setRemaining] = useState(() => deadline - Date.now())

  useEffect(() => {
    const id = setInterval(() => setRemaining(deadline - Date.now()), 1000)
    return () => clearInterval(id)
  }, [deadline])

  if (remaining <= 0) {
    return (
      <p className="rounded-lg bg-danger/10 px-3 py-2 text-center text-sm font-medium text-danger">
        This reservation has expired. Please start again.
      </p>
    )
  }

  const mins = Math.floor(remaining / 60000)
  const secs = Math.floor((remaining % 60000) / 1000)
  return (
    <p className="rounded-lg bg-primary-50 px-3 py-2 text-center text-sm text-primary-700">
      We’re holding these rooms for{' '}
      <span className="font-bold tabular-nums">
        {mins}:{String(secs).padStart(2, '0')}
      </span>
    </p>
  )
}

function CheckoutSkeleton() {
  return (
    <Container className="py-8">
      <Skeleton className="mb-4 h-4 w-16" />
      <Skeleton className="mb-2 h-8 w-64" />
      <Skeleton className="mb-8 h-4 w-80" />
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    </Container>
  )
}
