import { cn } from '@/lib/cn'
import { formatCurrency } from '@/lib/format'

interface PriceTagProps {
  amount: number
  /** Suffix after the amount, e.g. "night". Omit for a bare price. */
  per?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const amountSize: Record<NonNullable<PriceTagProps['size']>, string> = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-2xl',
}

/** Price display: bold amount + muted "/ per" suffix. */
export function PriceTag({ amount, per, size = 'md', className }: PriceTagProps) {
  return (
    <span className={cn('inline-flex items-baseline gap-1 text-ink-900', className)}>
      <span className={cn('font-bold', amountSize[size])}>{formatCurrency(amount)}</span>
      {per && <span className="text-sm font-normal text-ink-500">/ {per}</span>}
    </span>
  )
}
