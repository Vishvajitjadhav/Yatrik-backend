import { Link, useNavigate } from 'react-router-dom'
import { Badge, Container } from '@/components/ui'
import { useAuthStore } from '@/stores/authStore'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { addDays, todayIso } from '@/lib/format'
import { SearchBar } from '@/features/hotels/components/SearchBar'
import type { SearchValues } from '@/features/hotels/schemas'

const DESTINATIONS = [
  { city: 'Mumbai', img: '/destinations/mumbai.svg' },
  { city: 'New Delhi', img: '/destinations/new-delhi.svg' },
  { city: 'Goa', img: '/destinations/goa.svg' },
  { city: 'Bengaluru', img: '/destinations/bengaluru.svg' },
  { city: 'Jaipur', img: '/destinations/jaipur.svg' },
  { city: 'Udaipur', img: '/destinations/udaipur.svg' },
]

function destinationSearchUrl(city: string): string {
  const today = todayIso()
  const params = new URLSearchParams({
    city,
    startDate: addDays(today, 1),
    endDate: addDays(today, 2),
    rooms: '1',
    page: '0',
  })
  return `/search?${params.toString()}`
}

export function HomePage() {
  useDocumentTitle()
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  const runSearch = (values: SearchValues) => {
    const params = new URLSearchParams({
      city: values.city,
      startDate: values.startDate,
      endDate: values.endDate,
      rooms: String(values.roomsCount),
      page: '0',
    })
    navigate(`/search?${params.toString()}`)
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-bg">
        <Container className="flex flex-col items-center py-16 text-center sm:py-24">
          <Badge tone="brand" className="mb-5">
            ✦ The traveler's way to stay
          </Badge>
          <h1 className="max-w-3xl text-4xl font-bold text-ink-900 sm:text-5xl">
            Find a place that feels like <span className="text-primary-500">home</span>, anywhere
            you go.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-ink-500">
            {user
              ? `Welcome back, ${user.name}. Where to next?`
              : 'Discover and book hand-picked stays across the country with YATRIK.'}
          </p>

          <div className="mt-8 w-full max-w-4xl text-left">
            <SearchBar variant="hero" onSearch={runSearch} />
          </div>
        </Container>
      </section>

      {/* Popular destinations */}
      <Container className="py-14">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-ink-900">Popular destinations</h2>
            <p className="mt-1 text-ink-500">Trending cities travelers are booking now.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {DESTINATIONS.map(({ city, img }) => (
            <Link
              key={city}
              to={destinationSearchUrl(city)}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-sm"
            >
              <img
                src={img}
                alt={city}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 to-transparent" />
              <span className="absolute bottom-3 left-3 text-base font-bold text-white">
                {city}
              </span>
            </Link>
          ))}
        </div>
      </Container>

      {/* Value props */}
      <section className="border-t border-line bg-surface">
        <Container className="grid gap-6 py-16 sm:grid-cols-3">
          {[
            { title: 'Hand-picked hotels', body: 'Quality stays in every city, vetted for comfort.' },
            { title: 'Fair, dynamic pricing', body: 'Transparent prices that reflect real demand.' },
            { title: 'Book in seconds', body: 'A fast, secure checkout — reserve and go.' },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-line bg-surface p-6 shadow-sm">
              <h3 className="text-lg font-bold text-ink-900">{f.title}</h3>
              <p className="mt-2 text-ink-500">{f.body}</p>
            </div>
          ))}
        </Container>
      </section>
    </div>
  )
}
