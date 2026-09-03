import { useEffect } from 'react'

const BASE = 'YATRIK'

/**
 * Set the document title for a route, restoring the previous title on unmount.
 * Pass a page name (e.g. "Search") → "Search · YATRIK", or nothing for the base.
 */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    const previous = document.title
    document.title = title ? `${title} · ${BASE}` : `${BASE} — Book your stay`
    return () => {
      document.title = previous
    }
  }, [title])
}
