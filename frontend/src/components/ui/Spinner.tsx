import { cn } from '@/lib/cn'

interface SpinnerProps {
  className?: string
  /** px size of the spinner. */
  size?: number
  label?: string
}

/** Inline loading spinner (use for buttons/inline actions; use Skeleton for lists). */
export function Spinner({ className, size = 20, label = 'Loading' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn('inline-block animate-spin rounded-full border-2 border-current border-t-transparent', className)}
      style={{ width: size, height: size }}
    />
  )
}
