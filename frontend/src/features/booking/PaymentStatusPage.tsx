import { Link, useParams } from 'react-router-dom'
import { Button, Container, Spinner } from '@/components/ui'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import type { BookingStatus } from '@/types/api'
import { useBookingStatus } from './hooks'

/**
 * Landing page after Stripe checkout (the backend redirects here for both
 * success and failure). Polls the booking status until it settles, then shows
 * a confirmed / failed / pending result.
 */
export function PaymentStatusPage() {
  useDocumentTitle('Payment status')
  const { bookingId } = useParams()
  const id = Number(bookingId)
  const { data, isLoading, isError } = useBookingStatus(id)

  const status: BookingStatus | undefined = data?.bookingStatus

  if (isLoading && !status) {
    return (
      <Result icon={<Spinner size={40} />} title="Checking your payment…" tone="neutral">
        <p className="text-ink-500">Hang tight while we confirm your booking.</p>
      </Result>
    )
  }

  if (isError || Number.isNaN(id)) {
    return (
      <Result icon={<CrossIcon />} title="We couldn’t check this booking" tone="danger">
        <p className="text-ink-500">
          Something went wrong reaching the server. Your trips list always shows the latest status.
        </p>
        <Actions>
          <Link to="/bookings">
            <Button>Go to my trips</Button>
          </Link>
        </Actions>
      </Result>
    )
  }

  if (status === 'CONFIRMED') {
    return (
      <Result icon={<CheckIcon />} title="Booking confirmed!" tone="success">
        <p className="text-ink-500">
          Your payment went through and your stay is booked. A confirmation is on its way.
        </p>
        <Actions>
          <Link to="/bookings">
            <Button>View my trips</Button>
          </Link>
          <Link to="/search">
            <Button variant="outline">Keep exploring</Button>
          </Link>
        </Actions>
      </Result>
    )
  }

  if (status === 'CANCELLED' || status === 'EXPIRED') {
    return (
      <Result icon={<CrossIcon />} title="Payment not completed" tone="danger">
        <p className="text-ink-500">
          {status === 'EXPIRED'
            ? 'This reservation expired before payment finished.'
            : 'This booking was cancelled and no charge was made.'}{' '}
          You can search again and rebook.
        </p>
        <Actions>
          <Link to="/search">
            <Button>Back to search</Button>
          </Link>
          <Link to="/bookings">
            <Button variant="outline">My trips</Button>
          </Link>
        </Actions>
      </Result>
    )
  }

  // RESERVED / GUEST_ADDED / PAYMENTS_PENDING — still settling.
  return (
    <Result icon={<Spinner size={40} />} title="Payment processing…" tone="neutral">
      <p className="text-ink-500">
        We’re waiting for your payment to be confirmed. This can take a moment — this page updates
        automatically.
      </p>
      <Actions>
        <Link to="/bookings">
          <Button variant="outline">View my trips</Button>
        </Link>
      </Actions>
    </Result>
  )
}

type Tone = 'success' | 'danger' | 'neutral'

const ring: Record<Tone, string> = {
  success: 'bg-success/10 text-success',
  danger: 'bg-danger/10 text-danger',
  neutral: 'bg-primary-50 text-primary-600',
}

function Result({
  icon,
  title,
  tone,
  children,
}: {
  icon: React.ReactNode
  title: string
  tone: Tone
  children: React.ReactNode
}) {
  return (
    <Container className="py-20">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <div className={`grid h-20 w-20 place-items-center rounded-full ${ring[tone]}`}>{icon}</div>
        <h1 className="mt-6 text-2xl font-bold text-ink-900">{title}</h1>
        <div className="mt-2 space-y-4">{children}</div>
      </div>
    </Container>
  )
}

function Actions({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap justify-center gap-3 pt-2">{children}</div>
}

function CheckIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function CrossIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}
