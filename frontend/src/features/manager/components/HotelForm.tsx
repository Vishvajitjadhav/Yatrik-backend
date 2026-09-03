import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@/components/ui'
import { hotelSchema, type HotelFormValues } from '../schemas'
import { StringListInput } from './StringListInput'

interface HotelFormProps {
  defaultValues: HotelFormValues
  submitting?: boolean
  submitLabel: string
  onSubmit: (values: HotelFormValues) => void
  onCancel?: () => void
}

/** Create / edit form for a hotel's core details, contact info and media. */
export function HotelForm({
  defaultValues,
  submitting,
  submitLabel,
  onSubmit,
  onCancel,
}: HotelFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<HotelFormValues>({
    resolver: zodResolver(hotelSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <Section title="Basics">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Hotel name" placeholder="The Terracotta House" error={errors.name?.message} {...register('name')} />
          <Input label="City" placeholder="Jaipur" error={errors.city?.message} {...register('city')} />
        </div>
      </Section>

      <Section title="Contact">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Address" placeholder="12 Palace Road" {...register('contactInfo.address')} />
          <Input label="Location / area" placeholder="Civil Lines" {...register('contactInfo.location')} />
          <Input
            label="Email"
            type="email"
            placeholder="stay@hotel.com"
            error={errors.contactInfo?.email?.message}
            {...register('contactInfo.email')}
          />
          <Input label="Phone" placeholder="+91 98765 43210" {...register('contactInfo.phoneNumber')} />
        </div>
      </Section>

      <Section title="Media & amenities">
        <div className="space-y-4">
          <Controller
            control={control}
            name="photos"
            render={({ field }) => (
              <StringListInput
                label="Photo URLs"
                value={field.value}
                onChange={field.onChange}
                placeholder="https://…/room.jpg"
                hint="Paste image URLs. The guest gallery falls back to a placeholder if none are set."
                error={errors.photos?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="amenities"
            render={({ field }) => (
              <StringListInput
                label="Amenities"
                value={field.value}
                onChange={field.onChange}
                placeholder="e.g. Free Wi-Fi"
              />
            )}
          />
        </div>
      </Section>

      <div className="flex justify-end gap-3 border-t border-line pt-5">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-500">{title}</h3>
      {children}
    </section>
  )
}
