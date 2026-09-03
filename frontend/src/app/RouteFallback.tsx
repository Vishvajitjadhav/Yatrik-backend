import { Spinner } from '@/components/ui'

/** Suspense fallback shown while a lazily-loaded route chunk downloads. */
export function RouteFallback() {
  return (
    <div className="grid min-h-[60svh] place-items-center" role="status" aria-label="Loading">
      <Spinner size={32} />
    </div>
  )
}
