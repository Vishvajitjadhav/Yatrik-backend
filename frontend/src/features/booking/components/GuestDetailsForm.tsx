import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, IconButton, Input, Select } from '@/components/ui'
import type { Gender } from '@/types/api'
import { addGuestsSchema, type AddGuestsValues } from '../schemas'
import type { GuestPayload } from '../api'

interface GuestDetailsFormProps {
  /** How many blank guest rows to start with (from the chosen occupancy). */
  initialCount: number
  submitting?: boolean
  onSubmit: (guests: GuestPayload[]) => void
}

const genderOptions: { value: Gender; label: string }[] = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
]

const blankGuest = () => ({ name: '', gender: 'MALE' as Gender, age: undefined as unknown as number })

/** Repeatable name / age / gender form for everyone on the reservation. */
export function GuestDetailsForm({ initialCount, submitting, onSubmit }: GuestDetailsFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddGuestsValues>({
    resolver: zodResolver(addGuestsSchema),
    defaultValues: {
      guests: Array.from({ length: Math.max(1, initialCount) }, blankGuest),
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'guests' })

  return (
    <form onSubmit={handleSubmit((v) => onSubmit(v.guests))} noValidate className="space-y-4">
      {fields.map((field, i) => (
        <div key={field.id} className="rounded-2xl border border-line bg-surface p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink-900">Guest {i + 1}</h3>
            {fields.length > 1 && (
              <IconButton label={`Remove guest ${i + 1}`} size="sm" onClick={() => remove(i)}>
                <TrashIcon />
              </IconButton>
            )}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto]">
            <Input
              label="Full name"
              placeholder="e.g. Aarav Sharma"
              error={errors.guests?.[i]?.name?.message}
              {...register(`guests.${i}.name`)}
            />
            <div className="w-full sm:w-24">
              <Input
                label="Age"
                type="number"
                min={0}
                inputMode="numeric"
                placeholder="Age"
                error={errors.guests?.[i]?.age?.message}
                {...register(`guests.${i}.age`, { valueAsNumber: true })}
              />
            </div>
            <div className="w-full sm:w-36">
              <Select
                label="Gender"
                options={genderOptions}
                error={errors.guests?.[i]?.gender?.message}
                {...register(`guests.${i}.gender`)}
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append(blankGuest())}
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
      >
        <PlusIcon />
        Add another guest
      </button>

      <div className="pt-2">
        <Button type="submit" size="lg" fullWidth isLoading={submitting}>
          Continue to payment
        </Button>
      </div>
    </form>
  )
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}
