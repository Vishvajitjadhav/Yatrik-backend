import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  message?: string
  action?: ReactNode
  className?: string
}

/** Empty / error placeholder: icon + one-line message + optional primary action. */
export function EmptyState({ icon, title, message, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-line bg-surface px-6 py-14 text-center',
        className,
      )}
    >
      {icon && <div className="text-primary-400">{icon}</div>}
      <h3 className="text-lg font-bold text-ink-900">{title}</h3>
      {message && <p className="max-w-sm text-sm text-ink-500">{message}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
