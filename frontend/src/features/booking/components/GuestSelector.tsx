import { useState } from 'react'
import { Button, Modal } from '@/components/ui'
import { cn } from '@/lib/cn'
import { occupancyLabel, type Occupancy } from '../schemas'

interface GuestSelectorProps {
  value: Occupancy
  onChange: (value: Occupancy) => void
  /** Max adults + children (rooms × capacity). */
  maxGuests?: number
  className?: string
}

const ROWS: { key: keyof Occupancy; label: string; hint: string; min: number }[] = [
  { key: 'adults', label: 'Adults', hint: 'Ages 13 or above', min: 1 },
  { key: 'children', label: 'Children', hint: 'Ages 2–12', min: 0 },
  { key: 'infants', label: 'Infants', hint: 'Under 2', min: 0 },
]

/**
 * Airbnb-style occupancy picker: a trigger showing the current party, opening a
 * modal of +/- steppers for adults, children and infants.
 */
export function GuestSelector({ value, onChange, maxGuests = 20, className }: GuestSelectorProps) {
  const [open, setOpen] = useState(false)

  const beds = value.adults + value.children
  const set = (key: keyof Occupancy, next: number) => onChange({ ...value, [key]: next })

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'flex h-11 w-full items-center justify-between rounded-full border border-line bg-surface px-4 text-left text-sm',
          'transition-colors hover:border-ink-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30',
          className,
        )}
      >
        <span className="flex items-center gap-2 truncate text-ink-900">
          <GuestIcon />
          <span className="truncate font-medium">{occupancyLabel(value)}</span>
        </span>
        <ChevronIcon />
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Who's coming?"
        footer={<Button onClick={() => setOpen(false)}>Done</Button>}
      >
        <div className="divide-y divide-line">
          {ROWS.map((row) => {
            const count = value[row.key]
            const atCap = row.key !== 'infants' && beds >= maxGuests
            return (
              <div key={row.key} className="flex items-center justify-between py-4">
                <div>
                  <p className="font-semibold text-ink-900">{row.label}</p>
                  <p className="text-sm text-ink-500">{row.hint}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Stepper
                    label={`Decrease ${row.label}`}
                    disabled={count <= row.min}
                    onClick={() => set(row.key, Math.max(row.min, count - 1))}
                  >
                    –
                  </Stepper>
                  <span className="w-6 text-center font-semibold tabular-nums text-ink-900">
                    {count}
                  </span>
                  <Stepper
                    label={`Increase ${row.label}`}
                    disabled={atCap}
                    onClick={() => set(row.key, count + 1)}
                  >
                    +
                  </Stepper>
                </div>
              </div>
            )
          })}
        </div>
        {beds >= maxGuests && (
          <p className="mt-3 text-sm text-ink-500">
            This many guests may need more rooms — adjust rooms to fit everyone.
          </p>
        )}
      </Modal>
    </>
  )
}

function Stepper({
  children,
  label,
  disabled,
  onClick,
}: {
  children: React.ReactNode
  label: string
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'grid h-9 w-9 place-items-center rounded-full border border-ink-300 text-lg font-medium text-ink-700',
        'transition-colors hover:border-ink-900 hover:text-ink-900',
        'disabled:cursor-not-allowed disabled:border-line disabled:text-ink-300 disabled:hover:border-line',
      )}
    >
      {children}
    </button>
  )
}

function GuestIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink-500">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink-500">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
