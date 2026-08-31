import { cn } from '@/lib/cn'

interface RatingProps {
  /** 0–5. */
  value: number
  /** Number of reviews, shown in parentheses when provided. */
  count?: number
  size?: 'sm' | 'md'
  className?: string
}

/**
 * Compact star rating: a single filled star + numeric value (Airbnb-style),
 * optionally with a review count. Ratings aren't in the backend yet — this is
 * the reusable display for when reviews land (see roadmap 6c).
 */
export function Rating({ value, count, size = 'sm', className }: RatingProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-semibold text-ink-900',
        size === 'sm' ? 'text-sm' : 'text-base',
        className,
      )}
    >
      <svg
        className="text-star"
        width={size === 'sm' ? 14 : 16}
        height={size === 'sm' ? 14 : 16}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.4l-5.81 3.06L7.3 13.9 2.6 9.35l6.5-.95L12 2.5z" />
      </svg>
      {value.toFixed(1)}
      {count != null && <span className="font-normal text-ink-500">({count})</span>}
    </span>
  )
}
