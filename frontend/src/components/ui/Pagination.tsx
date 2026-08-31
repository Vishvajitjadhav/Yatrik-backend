import { cn } from '@/lib/cn'
import { IconButton } from './IconButton'

interface PaginationProps {
  /** Zero-based current page. */
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

/** Build the list of page numbers to show, with `-1` marking an ellipsis gap. */
function pageWindow(page: number, totalPages: number): number[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i)
  const pages = new Set([0, totalPages - 1, page, page - 1, page + 1])
  const sorted = [...pages].filter((p) => p >= 0 && p < totalPages).sort((a, b) => a - b)
  const out: number[] = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) out.push(-1)
    out.push(sorted[i])
  }
  return out
}

/** Zero-based pager with prev/next arrows and a compact number window. */
export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null
  const pages = pageWindow(page, totalPages)

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-1', className)}
    >
      <IconButton
        label="Previous page"
        size="sm"
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
      >
        <Chevron dir="left" />
      </IconButton>

      {pages.map((p, i) =>
        p === -1 ? (
          <span key={`gap-${i}`} className="px-1 text-ink-300" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(
              'h-9 min-w-9 rounded-md px-2 text-sm font-semibold transition-colors duration-150',
              p === page
                ? 'bg-primary-500 text-white'
                : 'text-ink-700 hover:bg-bg',
            )}
          >
            {p + 1}
          </button>
        ),
      )}

      <IconButton
        label="Next page"
        size="sm"
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
      >
        <Chevron dir="right" />
      </IconButton>
    </nav>
  )
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={dir === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
    </svg>
  )
}
