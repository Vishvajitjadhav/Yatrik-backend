import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, PriceTag } from '@/components/ui'
import { cn } from '@/lib/cn'
import type { HotelPrice } from '@/types/api'

/** Bundled placeholder shown when a hotel has no photos of its own. */
const PLACEHOLDER = '/placeholder-hotel.svg'

export function HotelCard({ entry }: { entry: HotelPrice }) {
  const { hotel, price } = entry
  const [favourite, setFavourite] = useState(false)
  const photo = hotel.photos?.[0] || PLACEHOLDER
  const location = hotel.contactInfo?.location || hotel.contactInfo?.address

  return (
    <Link
      to={`/hotels/${hotel.id}`}
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
        <button
          type="button"
          aria-label={favourite ? 'Remove from favourites' : 'Add to favourites'}
          aria-pressed={favourite}
          onClick={(e) => {
            e.preventDefault()
            setFavourite((v) => !v)
          }}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-surface/85 text-ink-700 backdrop-blur transition-colors hover:bg-surface"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={favourite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('transition-colors', favourite ? 'text-primary-500' : 'text-ink-700')}
          >
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium uppercase tracking-wide text-ink-500">
              {hotel.city}
              {location && <span className="normal-case text-ink-300"> · {location}</span>}
            </p>
            <h3 className="mt-0.5 truncate text-base font-bold text-ink-900">{hotel.name}</h3>
          </div>
          <Badge tone="neutral" className="shrink-0">
            New
          </Badge>
        </div>

        {hotel.amenities && hotel.amenities.length > 0 && (
          <p className="mt-1.5 line-clamp-1 text-sm text-ink-500">
            {hotel.amenities.slice(0, 3).join(' · ')}
          </p>
        )}

        <div className="mt-auto pt-3">
          <PriceTag amount={price} per="night" />
        </div>
      </div>
    </Link>
  )
}
