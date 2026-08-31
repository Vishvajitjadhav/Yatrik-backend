import { createPortal } from 'react-dom'
import { cn } from '@/lib/cn'
import { useToastStore, type ToastTone } from '@/stores/toastStore'

const toneStyles: Record<ToastTone, string> = {
  success: 'border-success/30 bg-success/10 text-success',
  error: 'border-danger/30 bg-danger/10 text-danger',
  info: 'border-line bg-surface text-ink-900',
}

/** Global toast outlet — mount once near the app root. */
export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  if (toasts.length === 0) return null

  return createPortal(
    <div className="pointer-events-none fixed left-1/2 top-6 z-[60] flex w-80 max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-col items-center gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={cn(
            'pointer-events-auto flex w-full items-start gap-3 rounded-md border px-4 py-3 text-sm font-medium shadow-md animate-[slideDown_200ms_ease]',
            toneStyles[t.tone],
          )}
        >
          <span className="flex-1">{t.message}</span>
          <button
            aria-label="Dismiss"
            onClick={() => dismiss(t.id)}
            className="opacity-60 transition-opacity hover:opacity-100"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>,
    document.body,
  )
}
