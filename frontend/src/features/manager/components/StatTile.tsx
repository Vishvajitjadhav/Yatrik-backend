import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface StatTileProps {
  label: string
  value: ReactNode
  sub?: string
  icon?: ReactNode
  className?: string
}

/** A single KPI tile: big value + label, optional sub-line and icon. */
export function StatTile({ label, value, sub, icon, className }: StatTileProps) {
  return (
    <div className={cn('rounded-2xl border border-line bg-surface p-5 shadow-sm', className)}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-ink-500">{label}</p>
        {icon && <span className="text-primary-500">{icon}</span>}
      </div>
      <p className="mt-2 text-3xl font-bold tabular-nums text-ink-900">{value}</p>
      {sub && <p className="mt-1 text-sm text-ink-500">{sub}</p>}
    </div>
  )
}
