import { Link } from 'react-router-dom'
import { Badge, Button, Container, EmptyState, Skeleton } from '@/components/ui'
import type { Hotel } from '@/types/api'
import { useMyHotels } from './hooks'

const PLACEHOLDER = '/placeholder-hotel.svg'

export function MyHotelsPage() {
  const { data, isLoading, isError, refetch } = useMyHotels()

  return (
    <Container className="py-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-ink-900">My hotels</h2>
        <Link to="/manager/hotels/new">
          <Button size="sm">
            <PlusIcon />
            New hotel
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          title="Couldn’t load your hotels"
          message="Something went wrong reaching the server. Please try again."
          action={<Button onClick={() => refetch()}>Retry</Button>}
        />
      ) : (data?.length ?? 0) === 0 ? (
        <EmptyState
          icon={<BuildingIcon />}
          title="No hotels yet"
          message="List your first property to start taking bookings on YATRIK."
          action={
            <Link to="/manager/hotels/new">
              <Button>Add your first hotel</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data!.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      )}
    </Container>
  )
}

function HotelCard({ hotel }: { hotel: Hotel }) {
  const photo = hotel.photos?.[0] || PLACEHOLDER
  const location = hotel.contactInfo?.location || hotel.contactInfo?.address
  return (
    <Link
      to={`/manager/hotels/${hotel.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-bg">
        <img
          src={photo}
          alt={hotel.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = PLACEHOLDER
          }}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />
        <div className="absolute left-3 top-3">
          {hotel.active ? (
            <Badge tone="success">● Live</Badge>
          ) : (
            <Badge tone="warning">Draft</Badge>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-ink-500">
          {hotel.city}
          {location && <span className="normal-case text-ink-300"> · {location}</span>}
        </p>
        <h3 className="mt-0.5 truncate text-base font-bold text-ink-900">{hotel.name}</h3>
        {hotel.amenities && hotel.amenities.length > 0 && (
          <p className="mt-1.5 line-clamp-1 text-sm text-ink-500">
            {hotel.amenities.slice(0, 3).join(' · ')}
          </p>
        )}
        <span className="mt-auto pt-3 text-sm font-semibold text-primary-600 group-hover:text-primary-700">
          Manage →
        </span>
      </div>
    </Link>
  )
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function BuildingIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M9 7h1m4 0h1M9 11h1m4 0h1M9 15h1m4 0h1" />
    </svg>
  )
}
