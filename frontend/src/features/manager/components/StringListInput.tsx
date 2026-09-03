import { useState } from 'react'
import { cn } from '@/lib/cn'

interface StringListInputProps {
  label: string
  value: string[]
  onChange: (next: string[]) => void
  placeholder?: string
  hint?: string
  error?: string
}

/**
 * Edits a list of strings (amenities, photo URLs) as removable chips. Add with
 * Enter or the Add button; duplicates and blanks are ignored.
 */
export function StringListInput({
  label,
  value,
  onChange,
  placeholder,
  hint,
  error,
}: StringListInputProps) {
  const [draft, setDraft] = useState('')

  const add = () => {
    const v = draft.trim()
    if (!v || value.includes(v)) {
      setDraft('')
      return
    }
    onChange([...value, v])
    setDraft('')
  }

  const remove = (item: string) => onChange(value.filter((v) => v !== item))

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-ink-700">{label}</label>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              add()
            }
          }}
          placeholder={placeholder}
          className={cn(
            'h-11 w-full rounded-full border border-line bg-surface px-4 text-base text-ink-900 placeholder:text-ink-300',
            'transition-colors duration-150 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30',
            error && 'border-danger focus:border-danger focus:ring-danger/30',
          )}
        />
        <button
          type="button"
          onClick={add}
          className="shrink-0 rounded-full border border-line bg-surface px-4 text-sm font-semibold text-ink-900 transition-colors hover:bg-bg"
        >
          Add
        </button>
      </div>

      {value.length > 0 && (
        <ul className="mt-1 flex flex-wrap gap-2">
          {value.map((item) => (
            <li
              key={item}
              className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-primary-50 py-1 pl-3 pr-1.5 text-sm text-primary-700"
            >
              <span className="truncate">{item}</span>
              <button
                type="button"
                aria-label={`Remove ${item}`}
                onClick={() => remove(item)}
                className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-primary-600 hover:bg-primary-100"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      {error ? (
        <p className="text-sm text-danger">{error}</p>
      ) : hint ? (
        <p className="text-sm text-ink-500">{hint}</p>
      ) : null}
    </div>
  )
}
