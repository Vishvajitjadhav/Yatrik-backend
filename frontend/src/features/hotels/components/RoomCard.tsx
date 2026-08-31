import { Button, PriceTag } from '@/components/ui'
import type { Room } from '@/types/api'

interface RoomCardProps {
  room: Room
  onReserve: (room: Room) => void
}

/** A single room type on the hotel detail page: specs + nightly price + reserve. */
export function RoomCard({ room, onReserve }: RoomCardProps) {
  const soldOut = room.totalCount <= 0

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h3 className="text-base font-bold text-ink-900">{room.type}</h3>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-500">
          <span className="inline-flex items-center gap-1">
            <GuestIcon />
            Sleeps {room.capacity}
          </span>
          {room.totalCount > 0 && <span>· {room.totalCount} available</span>}
        </div>
        {room.amenities && room.amenities.length > 0 && (
          <p className="mt-2 line-clamp-1 text-sm text-ink-500">
            {room.amenities.slice(0, 4).join(' · ')}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
        <PriceTag amount={room.basePrice} per="night" />
        <Button
          size="sm"
          disabled={soldOut}
          onClick={() => onReserve(room)}
          className="whitespace-nowrap"
        >
          {soldOut ? 'Sold out' : 'Reserve'}
        </Button>
      </div>
    </div>
  )
}

function GuestIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
