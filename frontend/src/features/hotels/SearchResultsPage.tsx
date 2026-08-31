import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button, Container, EmptyState, Pagination } from '@/components/ui'
import { formatDateRange, nightsBetween } from '@/lib/format'
import { SearchBar } from './components/SearchBar'
import { HotelCard } from './components/HotelCard'
import { HotelCardSkeleton } from './components/HotelCardSkeleton'
import { useHotelSearch } from './hooks'
import type { SearchValues } from './schemas'
import type { HotelPrice } from '@/types/api'

const PAGE_SIZE = 12

export function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const city = searchParams.get('city') ?? ''
  const startDate = searchParams.get('startDate') ?? ''
  const endDate = searchParams.get('endDate') ?? ''
  const roomsCount = Number(searchParams.get('rooms') ?? '1')
  const page = Number(searchParams.get('page') ?? '0')

  const params = useMemo(
    () =>
      city && startDate && endDate
        ? { city, startDate, endDate, roomsCount, page, size: PAGE_SIZE }
        : null,
    [city, startDate, endDate, roomsCount, page],
  )

  const { data, isLoading, isError, isFetching, refetch } = useHotelSearch(params)

  const applySearch = (values: SearchValues) => {
    setSearchParams({
      city: values.city,
      startDate: values.startDate,
      endDate: values.endDate,
      rooms: String(values.roomsCount),
      page: '0',
    })
  }

  const goToPage = (next: number) => {
    const p = new URLSearchParams(searchParams)
    p.set('page', String(next))
    setSearchParams(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const nights = startDate && endDate ? nightsBetween(startDate, endDate) : 0

  return (
    <Container className="py-6 sm:py-8">
      <div className="mb-6">
        <SearchBar
          variant="bar"
          onSearch={applySearch}
          defaultValues={
            city ? { city, startDate, endDate, roomsCount } : undefined
          }
        />
      </div>

      {/* Result header */}
      {params && (
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-xl font-bold text-ink-900 sm:text-2xl">
            Stays in {city}
          </h1>
          <p className="text-sm text-ink-500">
            {formatDateRange(startDate, endDate)} · {nights} night{nights === 1 ? '' : 's'} ·{' '}
            {roomsCount} room{roomsCount === 1 ? '' : 's'}
            {data && !isLoading ? ` · ${data.totalElements} found` : ''}
          </p>
        </div>
      )}

      <Content
        hasQuery={Boolean(params)}
        isLoading={isLoading || (isFetching && !data)}
        isError={isError}
        onRetry={refetch}
        results={data?.content ?? []}
      />

      {data && data.totalPages > 1 && (
        <Pagination
          page={data.number}
          totalPages={data.totalPages}
          onPageChange={goToPage}
          className="mt-10"
        />
      )}
    </Container>
  )
}

interface ContentProps {
  hasQuery: boolean
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  results: HotelPrice[]
}

function Content({ hasQuery, isLoading, isError, onRetry, results }: ContentProps) {
  const grid = 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

  if (!hasQuery) {
    return (
      <EmptyState
        icon={<SearchGlyph />}
        title="Start your search"
        message="Enter a destination and dates above to find available stays."
      />
    )
  }

  if (isLoading) {
    return (
      <div className={grid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <HotelCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <EmptyState
        icon={<SearchGlyph />}
        title="Couldn’t load stays"
        message="Something went wrong reaching the server. Please try again."
        action={<Button onClick={onRetry}>Retry</Button>}
      />
    )
  }

  if (results.length === 0) {
    return (
      <EmptyState
        icon={<SearchGlyph />}
        title="No stays found"
        message="No hotels match these dates in this city. Try different dates or another destination."
      />
    )
  }

  return (
    <div className={grid}>
      {results.map((entry) => (
        <HotelCard key={entry.hotel.id} entry={entry} />
      ))}
    </div>
  )
}

function SearchGlyph() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
