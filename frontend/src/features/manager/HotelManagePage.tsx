import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Badge,
  Button,
  Container,
  EmptyState,
  Modal,
  PriceTag,
  Skeleton,
} from '@/components/ui'
import { toast } from '@/stores/toastStore'
import type { Hotel, Room } from '@/types/api'
import { HotelForm } from './components/HotelForm'
import { RoomForm } from './components/RoomForm'
import type { HotelInput } from './api'
import {
  useActivateHotel,
  useCreateRoom,
  useDeleteHotel,
  useDeleteRoom,
  useHotelRooms,
  useManagerHotel,
  useUpdateHotel,
} from './hooks'
import type { HotelFormValues, RoomFormValues } from './schemas'

/** Turn a persisted hotel into the form's editable shape. */
function toFormValues(hotel: Hotel): HotelFormValues {
  return {
    name: hotel.name ?? '',
    city: hotel.city ?? '',
    photos: hotel.photos ?? [],
    amenities: hotel.amenities ?? [],
    contactInfo: {
      address: hotel.contactInfo?.address ?? '',
      location: hotel.contactInfo?.location ?? '',
      email: hotel.contactInfo?.email ?? '',
      phoneNumber: hotel.contactInfo?.phoneNumber ?? '',
    },
  }
}

export function HotelManagePage() {
  const { hotelId } = useParams()
  const id = Number(hotelId)
  const navigate = useNavigate()

  const hotelQuery = useManagerHotel(id)
  const roomsQuery = useHotelRooms(id)
  const update = useUpdateHotel(id)
  const activate = useActivateHotel(id)
  const deleteHotel = useDeleteHotel()

  const [addRoomOpen, setAddRoomOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (hotelQuery.isLoading) return <ManageSkeleton />

  if (hotelQuery.isError || !hotelQuery.data) {
    return (
      <Container className="py-16">
        <EmptyState
          title="Hotel not found"
          message="We couldn’t load this property. It may have been removed, or it isn’t yours."
          action={
            <Link to="/manager/hotels">
              <Button>Back to my hotels</Button>
            </Link>
          }
        />
      </Container>
    )
  }

  const hotel = hotelQuery.data

  const handleUpdate = (values: HotelFormValues) => {
    const body: HotelInput = { ...values, active: hotel.active }
    update.mutate(body, {
      onSuccess: () => toast.success('Hotel details saved.'),
      onError: (err) => toast.error((err as Error).message),
    })
  }

  const handleActivate = () => {
    activate.mutate(undefined, {
      onSuccess: () => toast.success('Hotel is now live and bookable.'),
      onError: (err) => toast.error((err as Error).message),
    })
  }

  const handleDeactivate = () => {
    update.mutate(
      { ...toFormValues(hotel), active: false },
      {
        onSuccess: () => toast.info('Hotel unpublished — it’s hidden from guests.'),
        onError: (err) => toast.error((err as Error).message),
      },
    )
  }

  const handleDeleteHotel = () => {
    deleteHotel.mutate(id, {
      onSuccess: () => {
        toast.success('Hotel deleted.')
        navigate('/manager/hotels')
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

      {/* Header + activation */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-bold text-ink-900">{hotel.name}</h2>
            {hotel.active ? (
              <Badge tone="success">● Live</Badge>
            ) : (
              <Badge tone="warning">Draft</Badge>
            )}
          </div>
          <p className="mt-1 text-ink-500">{hotel.city}</p>
        </div>
        <div className="flex items-center gap-2">
          {hotel.active ? (
            <Button variant="outline" isLoading={update.isPending} onClick={handleDeactivate}>
              Unpublish
            </Button>
          ) : (
            <Button isLoading={activate.isPending} onClick={handleActivate}>
              Publish hotel
            </Button>
          )}
        </div>
      </div>

      {!hotel.active && (
        <div className="mt-4 rounded-xl border border-warning/25 bg-warning/10 px-4 py-3 text-sm text-ink-700">
          This hotel is a <strong>draft</strong>. Add your rooms, then <strong>Publish</strong> to
          generate a year of availability and make it bookable.
        </div>
      )}

      {/* Rooms */}
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-xl font-bold text-ink-900">Rooms</h3>
          <Button size="sm" variant="secondary" onClick={() => setAddRoomOpen(true)}>
            + Add room
          </Button>
        </div>

        {roomsQuery.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        ) : roomsQuery.isError ? (
          <EmptyState
            title="Couldn’t load rooms"
            message="Please try again."
            action={<Button onClick={() => roomsQuery.refetch()}>Retry</Button>}
          />
        ) : (roomsQuery.data?.length ?? 0) === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-bg px-5 py-10 text-center">
            <p className="text-ink-500">No rooms yet. Add a room type to start selling.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {roomsQuery.data!.map((room) => (
              <RoomRow key={room.id} hotelId={id} room={room} />
            ))}
          </div>
        )}
      </section>

      {/* Edit details */}
      <section className="mt-10 border-t border-line pt-8">
        <h3 className="mb-4 text-xl font-bold text-ink-900">Hotel details</h3>
        <div className="max-w-3xl rounded-2xl border border-line bg-surface p-6 shadow-sm">
          <HotelForm
            defaultValues={toFormValues(hotel)}
            submitLabel="Save changes"
            submitting={update.isPending}
            onSubmit={handleUpdate}
          />
        </div>
      </section>

      {/* Danger zone */}
      <section className="mt-10 border-t border-line pt-8">
        <h3 className="text-xl font-bold text-ink-900">Danger zone</h3>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-danger/20 bg-danger/5 p-5">
          <div>
            <p className="font-semibold text-ink-900">Delete this hotel</p>
            <p className="text-sm text-ink-500">
              Permanently removes the hotel, its rooms and all future availability.
            </p>
          </div>
          <Button variant="danger" onClick={() => setConfirmDelete(true)}>
            Delete hotel
          </Button>
        </div>
      </section>

      {/* Add room modal */}
      <Modal open={addRoomOpen} onClose={() => setAddRoomOpen(false)} title="Add a room">
        <AddRoom hotelId={id} onDone={() => setAddRoomOpen(false)} />
      </Modal>

      {/* Delete hotel confirm */}
      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete hotel?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button variant="danger" isLoading={deleteHotel.isPending} onClick={handleDeleteHotel}>
              Delete permanently
            </Button>
          </>
        }
      >
        <p className="text-ink-700">
          This will permanently delete <strong>{hotel.name}</strong>, all of its rooms and their
          availability. This can’t be undone.
        </p>
      </Modal>
    </Container>
  )
}

function AddRoom({ hotelId, onDone }: { hotelId: number; onDone: () => void }) {
  const create = useCreateRoom(hotelId)
  const handleSubmit = (values: RoomFormValues) => {
    create.mutate(values, {
      onSuccess: () => {
        toast.success('Room added.')
        onDone()
      },
      onError: (err) => toast.error((err as Error).message),
    })
  }
  return <RoomForm submitting={create.isPending} onSubmit={handleSubmit} onCancel={onDone} />
}

function RoomRow({ hotelId, room }: { hotelId: number; room: Room }) {
  const [confirm, setConfirm] = useState(false)
  const del = useDeleteRoom(hotelId)

  const handleDelete = () => {
    del.mutate(room.id, {
      onSuccess: () => toast.success(`“${room.type}” removed.`),
      onError: (err) => toast.error((err as Error).message),
    })
    setConfirm(false)
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h4 className="font-bold text-ink-900">{room.type}</h4>
        <p className="mt-0.5 text-sm text-ink-500">
          Sleeps {room.capacity} · {room.totalCount} in inventory
          {room.amenities && room.amenities.length > 0 && (
            <> · {room.amenities.slice(0, 3).join(' · ')}</>
          )}
        </p>
      </div>
      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <PriceTag amount={Number(room.basePrice)} per="night" />
        <Button
          size="sm"
          variant="outline"
          isLoading={del.isPending}
          onClick={() => setConfirm(true)}
          className="whitespace-nowrap"
        >
          Delete
        </Button>
      </div>

      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Delete room?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirm(false)}>
              Cancel
            </Button>
            <Button variant="danger" isLoading={del.isPending} onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-ink-700">
          Remove <strong>{room.type}</strong> and its future availability? This can’t be undone.
        </p>
      </Modal>
    </div>
  )
}

function ManageSkeleton() {
  return (
    <Container className="py-8">
      <Skeleton className="mb-4 h-4 w-24" />
      <Skeleton className="mb-2 h-8 w-64" />
      <Skeleton className="mb-8 h-4 w-32" />
      <Skeleton className="mb-3 h-6 w-24" />
      <div className="space-y-3">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
    </Container>
  )
}
