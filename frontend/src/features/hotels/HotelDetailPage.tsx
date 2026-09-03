import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Badge, Button, Container, EmptyState, Rating, Select, Skeleton } from '@/components/ui'
import { useAuthStore } from '@/stores/authStore'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { addDays, todayIso } from '@/lib/format'
import { GuestSelector } from '@/features/booking/components/GuestSelector'
import { DEFAULT_OCCUPANCY, type Occupancy } from '@/features/booking/schemas'
import type { Room } from '@/types/api'
import { DateRangePicker } from './components/DateRangePicker'
import { HotelGallery } from './components/HotelGallery'
import { RoomCard } from './components/RoomCard'
import { useHotelInfo } from './hooks'

const roomOptions = Array.from({ length: 8 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1} room${i > 0 ? 's' : ''}`,
}))

export function HotelDetailPage() {
  const { hotelId } = useParams()
  const id = Number(hotelId)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const user = useAuthStore((s) => s.user)
  const { data, isLoading, isError, refetch } = useHotelInfo(id)
  useDocumentTitle(data?.hotel.name)

  const today = todayIso()
  // Seed the stay from any dates carried over from search; else sensible defaults.
  const [checkIn, setCheckIn] = useState(searchParams.get('startDate') || addDays(today, 1))
  const [checkOut, setCheckOut] = useState(searchParams.get('endDate') || addDays(today, 2))
  const [roomsCount, setRoomsCount] = useState(() =>
    Math.max(1, Number(searchParams.get('rooms')) || 1),
  )
  const [occupancy, setOccupancy] = useState<Occupancy>(DEFAULT_OCCUPANCY)

  const handleReserve = (room: Room) => {
    if (!user) {
      navigate('/login', { state: { from: `/hotels/${id}` } })
      return
    }
    const params = new URLSearchParams({
      hotelId: String(id),
      roomId: String(room.id),
      checkIn,
      checkOut,
      rooms: String(roomsCount),
      adults: String(occupancy.adults),
      children: String(occupancy.children),
      infants: String(occupancy.infants),
    })
    navigate(`/book?${params.toString()}`)
  }

  if (isLoading) return <DetailSkeleton />

  if (isError || !data) {
    return (
      <Container className="py-16">
        <EmptyState
          title="Hotel not found"
          message="We couldn’t load this stay. It may have been removed or the link is invalid."
          action={
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => refetch()}>
                Retry
              </Button>
              <Link to="/search">
                <Button>Back to search</Button>
              </Link>
            </div>
          }
        />
      </Container>
    )
  }

  const { hotel, rooms } = data
  const contact = hotel.contactInfo
  const location = contact?.location || contact?.address

  return (
    <Container className="py-6 sm:py-8">
      <Link
        to="/search"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-ink-500 hover:text-ink-900"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to search
      </Link>

      {/* Header */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-ink-900 sm:text-3xl">{hotel.name}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-500">
            <Rating value={4.6} />
            <span aria-hidden="true">·</span>
            <span>
              {hotel.city}
              {location && ` · ${location}`}
            </span>
          </div>
        </div>
        <Badge tone="trust">✓ Verified stay</Badge>
      </div>

      <HotelGallery photos={hotel.photos} />

      {/* Body */}
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <section>
            <h2 className="text-xl font-bold text-ink-900">About this stay</h2>
            <p className="mt-2 text-ink-700">
              A comfortable stay in {hotel.city}, thoughtfully equipped for travelers. Choose from{' '}
              {rooms.length} room type{rooms.length === 1 ? '' : 's'} below.
            </p>
          </section>

          {hotel.amenities && hotel.amenities.length > 0 && (
            <section className="mt-8 border-t border-line pt-6">
              <h2 className="text-xl font-bold text-ink-900">What this place offers</h2>
              <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {hotel.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-ink-700">
                    <svg className="text-trust-600" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    {a}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Reviews — placeholder until reviews land (roadmap 6c) */}
          <section className="mt-8 border-t border-line pt-6">
            <h2 className="text-xl font-bold text-ink-900">Reviews</h2>
            <div className="mt-3 rounded-lg border border-dashed border-line bg-bg px-5 py-8 text-center text-sm text-ink-500">
              Guest reviews are coming soon.
            </div>
          </section>
        </div>

        {/* Contact card */}
        <aside className="lg:col-span-1">
          <div className="rounded-lg border border-line bg-surface p-5 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-ink-900">Contact</h2>
            <dl className="mt-3 space-y-3 text-sm">
              {contact?.address && (
                <ContactRow label="Address" value={contact.address} />
              )}
              {contact?.location && (
                <ContactRow label="Location" value={contact.location} />
              )}
              {contact?.email && <ContactRow label="Email" value={contact.email} />}
              {contact?.phoneNumber && (
                <ContactRow label="Phone" value={contact.phoneNumber} />
              )}
              {!contact?.address &&
                !contact?.location &&
                !contact?.email &&
                !contact?.phoneNumber && (
                  <p className="text-ink-500">No contact details provided.</p>
                )}
            </dl>
          </div>
        </aside>
      </div>

      {/* Rooms */}
      <section className="mt-10 border-t border-line pt-8">
        <h2 className="text-xl font-bold text-ink-900">Choose your room</h2>

        {/* Stay controls — shared across every room's Reserve action. */}
        <div className="mt-4 grid gap-3 rounded-2xl border border-line bg-bg p-4 sm:grid-cols-[2fr_1fr_1fr]">
          <div>
            <span className="mb-1.5 block text-sm font-medium text-ink-700">Dates</span>
            <div className="rounded-full border border-line bg-surface px-2">
              <DateRangePicker
                startDate={checkIn}
                endDate={checkOut}
                minDate={today}
                onChange={({ startDate, endDate }) => {
                  setCheckIn(startDate)
                  setCheckOut(endDate)
                }}
              />
            </div>
          </div>
          <div>
            <span className="mb-1.5 block text-sm font-medium text-ink-700">Rooms</span>
            <Select
              options={roomOptions}
              value={String(roomsCount)}
              onChange={(e) => setRoomsCount(Number(e.target.value))}
            />
          </div>
          <div>
            <span className="mb-1.5 block text-sm font-medium text-ink-700">Guests</span>
            <GuestSelector value={occupancy} onChange={setOccupancy} />
          </div>
        </div>

        {rooms.length === 0 ? (
          <p className="mt-3 text-ink-500">No rooms are listed for this stay yet.</p>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} onReserve={handleReserve} />
            ))}
          </div>
        )}
      </section>
    </Container>
  )
}

function ContactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="shrink-0 text-ink-500">{label}</dt>
      <dd className="text-right font-medium text-ink-900">{value}</dd>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <Container className="py-8">
      <Skeleton className="mb-4 h-4 w-28" />
      <Skeleton className="mb-2 h-8 w-2/3" />
      <Skeleton className="mb-6 h-4 w-1/3" />
      <Skeleton className="aspect-[16/9] w-full rounded-lg" />
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    </Container>
  )
}
