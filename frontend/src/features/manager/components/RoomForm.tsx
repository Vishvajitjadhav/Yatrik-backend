import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@/components/ui'
import { roomSchema, type RoomFormValues } from '../schemas'
import { StringListInput } from './StringListInput'

interface RoomFormProps {
  submitting?: boolean
  onSubmit: (values: RoomFormValues) => void
  onCancel: () => void
}

const EMPTY: RoomFormValues = {
  type: '',
  basePrice: undefined as unknown as number,
  totalCount: undefined as unknown as number,
  capacity: undefined as unknown as number,
  photos: [],
  amenities: [],
}

/** Create a room type: pricing, inventory count and capacity. */
export function RoomForm({ submitting, onSubmit, onCancel }: RoomFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RoomFormValues>({ resolver: zodResolver(roomSchema), defaultValues: EMPTY })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Input label="Room type" placeholder="Deluxe King" error={errors.type?.message} {...register('type')} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          label="Price / night (₹)"
          type="number"
          min={0}
          inputMode="numeric"
          placeholder="4200"
          error={errors.basePrice?.message}
          {...register('basePrice', { valueAsNumber: true })}
        />
        <Input
          label="Rooms (inventory)"
          type="number"
          min={1}
          inputMode="numeric"
          placeholder="10"
          error={errors.totalCount?.message}
          {...register('totalCount', { valueAsNumber: true })}
        />
        <Input
          label="Sleeps (capacity)"
          type="number"
          min={1}
          inputMode="numeric"
          placeholder="2"
          error={errors.capacity?.message}
          {...register('capacity', { valueAsNumber: true })}
        />
      </div>

      <Controller
        control={control}
        name="amenities"
        render={({ field }) => (
          <StringListInput
            label="Room amenities"
            value={field.value}
            onChange={field.onChange}
            placeholder="e.g. King bed"
          />
        )}
      />
      <Controller
        control={control}
        name="photos"
        render={({ field }) => (
          <StringListInput
            label="Photo URLs"
            value={field.value}
            onChange={field.onChange}
            placeholder="https://…/room.jpg"
          />
        )}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={submitting}>
          Add room
        </Button>
      </div>
    </form>
  )
}
