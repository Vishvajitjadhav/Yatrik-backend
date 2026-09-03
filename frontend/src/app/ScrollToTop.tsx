import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Resets scroll to the top on each route change (SPAs otherwise keep the old
 * scroll position). Respects reduced-motion by jumping instead of smooth-scrolling.
 */
export function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}
