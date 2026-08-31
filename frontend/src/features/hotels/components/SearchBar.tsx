import type { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/cn'
import { addDays, todayIso } from '@/lib/format'
import { searchSchema, type SearchValues } from '../schemas'
import { DateRangePicker } from './DateRangePicker'

interface SearchBarProps {
  defaultValues?: Partial<SearchValues>
  onSearch: (values: SearchValues) => void
  /** `hero` (landing, larger shadow) vs `bar` (above results). */
  variant?: 'hero' | 'bar'
}

const roomOptions = Array.from({ length: 8 }, (_, i) => i + 1)

export function SearchBar({ defaultValues, onSearch, variant = 'hero' }: SearchBarProps) {
  const today = todayIso()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SearchValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      city: '',
      startDate: addDays(today, 1),
      endDate: addDays(today, 2),
      roomsCount: 1,
      ...defaultValues,
    },
  })

  const startDate = watch('startDate')
  const endDate = watch('endDate')
  const firstError =
    errors.city?.message ??
    errors.startDate?.message ??
    errors.endDate?.message ??
    errors.roomsCount?.message

  const fieldInput =
    'w-full border-0 bg-transparent p-0 text-sm font-medium text-ink-900 ' +
    'placeholder:font-normal placeholder:text-ink-300 focus:outline-none focus:ring-0 [color-scheme:light]'

  return (
    <form onSubmit={handleSubmit(onSearch)} noValidate className="w-full">
      <div
        className={cn(
          'relative flex flex-col gap-1 rounded-3xl border border-line bg-surface p-2',
          'md:flex-row md:items-center md:gap-0 md:rounded-full md:p-1.5 md:pl-3',
          variant === 'hero' ? 'shadow-md' : 'shadow-sm',
        )}
      >
        <Field title="Where" invalid={Boolean(errors.city)}>
          <input
            type="text"
            autoComplete="off"
            placeholder="Search destinations"
            className={fieldInput}
            {...register('city')}
          />
        </Field>

        <Divider />

        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          minDate={today}
          invalid={{ start: Boolean(errors.startDate), end: Boolean(errors.endDate) }}
          onChange={({ startDate, endDate }) => {
            setValue('startDate', startDate, { shouldValidate: true })
            setValue('endDate', endDate, { shouldValidate: true })
          }}
        />

        <Divider />

        <Field title="Rooms" invalid={Boolean(errors.roomsCount)}>
          <select
            className={cn(fieldInput, 'cursor-pointer appearance-none')}
            {...register('roomsCount', { valueAsNumber: true })}
          >
            {roomOptions.map((n) => (
              <option key={n} value={n}>
                {n} room{n > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </Field>

        <button
          type="submit"
          aria-label="Search"
          className={cn(
            'mt-1 flex h-12 items-center justify-center gap-2 rounded-full bg-primary-500 font-semibold text-white',
            'shadow-sm transition-all duration-150 hover:bg-primary-600 active:scale-[0.98]',
            'md:ml-2 md:mt-0 md:h-12 md:w-12 md:shrink-0',
          )}
        >
          <SearchIcon />
          <span className="md:hidden">Search</span>
        </button>
      </div>

      {firstError && (
        <p role="alert" className="mt-2 pl-4 text-sm font-medium text-danger">
          {firstError}
        </p>
      )}
    </form>
  )
}

/** One labelled, borderless segment of the search pill. */
function Field({
  title,
  invalid,
  children,
}: {
  title: string
  invalid?: boolean
  children: ReactNode
}) {
  return (
    <label
      className={cn(
        'flex-1 cursor-pointer rounded-full px-4 py-1.5 transition-colors md:hover:bg-black/[0.06]',
        invalid && 'md:hover:bg-danger/10',
      )}
    >
      <span className={cn('block text-xs font-semibold', invalid ? 'text-danger' : 'text-ink-900')}>
        {title}
      </span>
      {children}
    </label>
  )
}

/** Thin separator: a horizontal rule between stacked fields, vertical between inline ones. */
function Divider() {
  return <span className="h-px w-full shrink-0 bg-line md:h-7 md:w-px" aria-hidden="true" />
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
