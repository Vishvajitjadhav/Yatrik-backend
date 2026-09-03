import { Link, useNavigate } from 'react-router-dom'
import { Container } from '@/components/ui'
import { toast } from '@/stores/toastStore'
import { HotelForm } from './components/HotelForm'
import { useCreateHotel } from './hooks'
import { EMPTY_HOTEL, type HotelFormValues } from './schemas'

/** Create a brand-new hotel (starts as a draft until activated). */
export function HotelFormPage() {
  const navigate = useNavigate()
  const create = useCreateHotel()

  const handleSubmit = (values: HotelFormValues) => {
    create.mutate(values, {
      onSuccess: (hotel) => {
        toast.success('Hotel created. Add rooms, then activate it to go live.')
        navigate(`/manager/hotels/${hotel.id}`)
      },
      onError: (err) => toast.error((err as Error).message),
    })
  }

  return (
    <Container className="py-8">
      <Link
        to="/manager/hotels"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-ink-500 hover:text-ink-900"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
        My hotels
      </Link>

      <h2 className="text-2xl font-bold text-ink-900">New hotel</h2>
      <p className="mt-1 mb-6 text-ink-500">
        Add the basics now — you can add rooms and photos before you publish.
      </p>

      <div className="max-w-3xl rounded-2xl border border-line bg-surface p-6 shadow-sm">
        <HotelForm
          defaultValues={EMPTY_HOTEL}
          submitLabel="Create hotel"
          submitting={create.isPending}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/manager/hotels')}
        />
      </div>
    </Container>
  )
}
