import { useQueries } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Badge, Button, Container, EmptyState, Skeleton } from '@/components/ui'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { formatCurrency } from '@/lib/format'
import type { Room } from '@/types/api'
import { managerApi } from './api'
import { useMyHotels } from './hooks'
import { StatTile } from './components/StatTile'

export function ManagerOverviewPage() {
  useDocumentTitle('Manager · Overview')
  const { data: hotels, isLoading, isError, refetch } = useMyHotels()

  // Fetch rooms for each hotel to build real inventory/pricing aggregates.
  const roomQueries = useQueries({
    queries: (hotels ?? []).map((h) => ({
      queryKey: ['manager', 'rooms', h.id],
      queryFn: () => managerApi.listRooms(h.id),
    })),
  })

  if (isLoading) {
    return (
      <Container className="py-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
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
          title="Couldn’t load your dashboard"
          message="Something went wrong reaching the server. Please try again."
          action={<Button onClick={() => refetch()}>Retry</Button>}
        />
      </Container>
    )
  }

  const list = hotels ?? []

  if (list.length === 0) {
    return (
      <Container className="py-16">
        <EmptyState
          title="Welcome to your dashboard"
          message="Once you list a property, your portfolio stats will appear here."
          action={
            <Link to="/manager/hotels/new">
              <Button>List your first hotel</Button>
            </Link>
          }
        />
      </Container>
    )
  }

  const live = list.filter((h) => h.active).length
  const cities = new Set(list.map((h) => h.city).filter(Boolean)).size

  const allRooms: Room[] = roomQueries.flatMap((q) => q.data ?? [])
  const roomsLoading = roomQueries.some((q) => q.isLoading)
  const inventory = allRooms.reduce((sum, r) => sum + (r.totalCount ?? 0), 0)
  const prices = allRooms.map((r) => Number(r.basePrice)).filter((n) => n > 0)
  const minPrice = prices.length ? Math.min(...prices) : 0
  const maxPrice = prices.length ? Math.max(...prices) : 0

  return (
    <Container className="py-8">
      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Properties" value={list.length} sub={`across ${cities} cit${cities === 1 ? 'y' : 'ies'}`} />
        <StatTile
          label="Live"
          value={live}
          sub={`${list.length - live} in draft`}
        />
        <StatTile
          label="Room types"
          value={roomsLoading ? '—' : allRooms.length}
          sub={roomsLoading ? 'loading…' : `${inventory} rooms in inventory`}
        />
        <StatTile
          label="Nightly range"
          value={prices.length ? formatCurrency(minPrice) : '—'}
          sub={prices.length ? `up to ${formatCurrency(maxPrice)}` : 'no rooms priced yet'}
        />
      </div>

      {/* Per-hotel breakdown */}
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink-900">Your properties</h2>
          <Link to="/manager/hotels">
            <Button size="sm" variant="ghost">
              Manage all →
            </Button>
          </Link>
        </div>
        <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-line bg-bg text-left text-ink-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Hotel</th>
                <th className="px-4 py-3 font-semibold">City</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Rooms</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {list.map((h, i) => (
                <tr key={h.id} className="hover:bg-bg/60">
                  <td className="px-4 py-3 font-semibold text-ink-900">{h.name}</td>
                  <td className="px-4 py-3 text-ink-700">{h.city}</td>
                  <td className="px-4 py-3">
                    {h.active ? (
                      <Badge tone="success">● Live</Badge>
                    ) : (
                      <Badge tone="warning">Draft</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-ink-700">
                    {roomsLoading ? '—' : (roomQueries[i]?.data?.length ?? 0)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/manager/hotels/${h.id}`}
                      className="font-semibold text-primary-600 hover:text-primary-700"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Analytics placeholder — needs a backend report endpoint (roadmap 6b). */}
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-bold text-ink-900">Bookings & occupancy</h2>
        <div className="rounded-2xl border border-dashed border-line bg-surface px-6 py-10 text-center">
          <p className="mx-auto max-w-md text-sm text-ink-500">
            Occupancy, revenue and check-in analytics arrive with the reporting API (roadmap 6b).
            The dashboard above already reflects your live portfolio.
          </p>
        </div>
      </section>
    </Container>
  )
}
