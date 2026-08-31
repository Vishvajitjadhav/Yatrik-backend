import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import { addDays, formatDate, parseDate, toIso, todayIso } from '@/lib/format'

interface DateRangePickerProps {
  startDate: string
  endDate: string
  /** Earliest selectable day (yyyy-MM-dd). Defaults to today. */
  minDate?: string
  onChange: (range: { startDate: string; endDate: string }) => void
  invalid?: { start?: boolean; end?: boolean }
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/** Days of a month as a flat cell list, padded with nulls for the leading weekday offset. */
function monthCells(year: number, month: number): (Date | null)[] {
  const lead = new Date(year, month, 1).getDay()
  const count = new Date(year, month + 1, 0).getDate()
  const cells: (Date | null)[] = Array.from({ length: lead }, () => null)
  for (let d = 1; d <= count; d++) cells.push(new Date(year, month, d))
  return cells
}

/**
 * Airbnb-style range calendar: two labelled trigger segments (Check in / Check out)
 * that open a shared popover with a dual-month calendar, hover-preview range
 * selection, and quick-duration shortcuts. Emits `yyyy-MM-dd` strings.
 */
export function DateRangePicker({
  startDate,
  endDate,
  minDate,
  onChange,
  invalid,
}: DateRangePickerProps) {
  const today = todayIso()
  const min = minDate ?? today

  const [open, setOpen] = useState(false)
  const [focus, setFocus] = useState<'start' | 'end'>('start')
  const [draftStart, setDraftStart] = useState(startDate)
  const [draftEnd, setDraftEnd] = useState(endDate)
  const [hover, setHover] = useState<string | null>(null)
  const [view, setView] = useState(() => {
    const base = parseDate(startDate || min)
    return { year: base.getFullYear(), month: base.getMonth() }
  })

  const wrapRef = useRef<HTMLDivElement>(null)

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return
    const onDown = (e: globalThis.MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const openAt = (which: 'start' | 'end') => {
    setDraftStart(startDate)
    setDraftEnd(endDate)
    const base = parseDate((which === 'end' ? startDate : startDate) || min)
    setView({ year: base.getFullYear(), month: base.getMonth() })
    setFocus(which)
    setOpen(true)
  }

  const commit = (s: string, e: string) => {
    onChange({ startDate: s, endDate: e })
    setOpen(false)
    setHover(null)
  }

  const pickDay = (iso: string) => {
    if (iso < min) return
    if (!draftStart || (draftStart && draftEnd)) {
      setDraftStart(iso)
      setDraftEnd('')
      setFocus('end')
    } else if (iso <= draftStart) {
      setDraftStart(iso)
      setDraftEnd('')
      setFocus('end')
    } else {
      setDraftEnd(iso)
      commit(draftStart, iso)
    }
  }

  const quick = (nights: number, fromWeekend = false) => {
    let s = addDays(today, 1)
    if (fromWeekend) {
      // next Friday
      const d = parseDate(today)
      const delta = (5 - d.getDay() + 7) % 7 || 7
      s = addDays(today, delta)
    }
    commit(s, addDays(s, nights))
  }

  // Effective end for range highlighting: the chosen end, or the hovered day while picking.
  const previewEnd = draftEnd || (draftStart && hover && hover > draftStart ? hover : '')

  return (
    <div ref={wrapRef} className="relative flex flex-col md:flex-[2] md:flex-row md:items-center">
      <Trigger
        title="Check in"
        value={startDate}
        active={open && focus === 'start'}
        invalid={invalid?.start}
        onClick={() => openAt('start')}
      />
      <span className="h-px w-full shrink-0 bg-line md:h-7 md:w-px" aria-hidden="true" />
      <Trigger
        title="Check out"
        value={endDate}
        active={open && focus === 'end'}
        invalid={invalid?.end}
        onClick={() => openAt('end')}
      />

      {open && (
        <div
          className="absolute left-0 top-full z-50 mt-3 w-full rounded-3xl border border-line bg-surface p-5 shadow-lg md:w-[620px]"
          role="dialog"
          aria-label="Choose dates"
        >
          {/* Quick durations */}
          <div className="mb-4 flex flex-wrap gap-2">
            <Chip onClick={() => quick(2, true)}>This weekend</Chip>
            <Chip onClick={() => quick(7)}>1 week</Chip>
            <Chip onClick={() => quick(30)}>1 month</Chip>
          </div>

          {/* Month nav */}
          <div className="mb-2 flex items-center justify-between">
            <NavButton
              label="Previous month"
              dir="left"
              disabled={
                view.year === parseDate(min).getFullYear() &&
                view.month === parseDate(min).getMonth()
              }
              onClick={() =>
                setView((v) => {
                  const d = new Date(v.year, v.month - 1, 1)
                  return { year: d.getFullYear(), month: d.getMonth() }
                })
              }
            />
            <NavButton
              label="Next month"
              dir="right"
              onClick={() =>
                setView((v) => {
                  const d = new Date(v.year, v.month + 1, 1)
                  return { year: d.getFullYear(), month: d.getMonth() }
                })
              }
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Month
              year={view.year}
              month={view.month}
              min={min}
              start={draftStart}
              end={previewEnd}
              onPick={pickDay}
              onHover={setHover}
            />
            <div className="hidden sm:block">
              <Month
                year={view.month === 11 ? view.year + 1 : view.year}
                month={(view.month + 1) % 12}
                min={min}
                start={draftStart}
                end={previewEnd}
                onPick={pickDay}
                onHover={setHover}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
            <button
              type="button"
              onClick={() => {
                setDraftStart('')
                setDraftEnd('')
                setFocus('start')
              }}
              className="text-sm font-semibold text-ink-700 underline-offset-2 hover:underline"
            >
              Clear dates
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Month({
  year,
  month,
  min,
  start,
  end,
  onPick,
  onHover,
}: {
  year: number
  month: number
  min: string
  start: string
  end: string
  onPick: (iso: string) => void
  onHover: (iso: string | null) => void
}) {
  const cells = useMemo(() => monthCells(year, month), [year, month])

  return (
    <div>
      <p className="mb-2 text-center text-sm font-bold text-ink-900">
        {MONTHS[month]} {year}
      </p>
      <div className="mb-1 grid grid-cols-7 text-center text-xs font-medium text-ink-500">
        {WEEKDAYS.map((w) => (
          <span key={w} className="py-1">
            {w}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7" onMouseLeave={() => onHover(null)}>
        {cells.map((date, i) => {
          if (!date) return <span key={`e${i}`} />
          const iso = toIso(date)
          const disabled = iso < min
          const isStart = Boolean(start) && iso === start
          const isEnd = Boolean(end) && iso === end
          const inRange = Boolean(start) && Boolean(end) && iso > start && iso < end
          const isEdge = isStart || isEnd
          const hasRange = Boolean(start) && Boolean(end) && start !== end

          return (
            <div
              key={iso}
              className={cn(
                'flex items-center justify-center py-0.5',
                hasRange && inRange && 'bg-primary-50',
                hasRange && isStart && 'rounded-l-full bg-primary-50',
                hasRange && isEnd && 'rounded-r-full bg-primary-50',
              )}
            >
              <button
                type="button"
                disabled={disabled}
                onClick={() => onPick(iso)}
                onMouseEnter={() => onHover(iso)}
                className={cn(
                  'h-10 w-10 rounded-full text-sm transition-colors',
                  disabled && 'cursor-not-allowed text-ink-300 line-through',
                  !disabled && !isEdge && 'text-ink-900 hover:border hover:border-ink-900',
                  isEdge && 'bg-primary-500 font-semibold text-white',
                )}
              >
                {date.getDate()}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Trigger({
  title,
  value,
  active,
  invalid,
  onClick,
}: {
  title: string
  value: string
  active?: boolean
  invalid?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex-1 rounded-full px-4 py-1.5 text-left transition-colors md:hover:bg-black/[0.06]',
        active && 'bg-black/[0.06] ring-1 ring-inset ring-ink-900/10',
      )}
    >
      <span className={cn('block text-xs font-semibold', invalid ? 'text-danger' : 'text-ink-900')}>
        {title}
      </span>
      <span className={cn('block text-sm font-medium', value ? 'text-ink-900' : 'text-ink-300')}>
        {value ? formatDate(value) : 'Add date'}
      </span>
    </button>
  )
}

function Chip({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-line px-3 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:border-ink-900 hover:bg-bg"
    >
      {children}
    </button>
  )
}

function NavButton({
  label,
  dir,
  disabled,
  onClick,
}: {
  label: string
  dir: 'left' | 'right'
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded-full text-ink-700 transition-colors hover:bg-bg disabled:opacity-30"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={dir === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
      </svg>
    </button>
  )
}
