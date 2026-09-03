import { Outlet } from 'react-router-dom'
import { ScrollToTop } from '@/app/ScrollToTop'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

/** App chrome shared by all public/guest pages: navbar + routed content + footer. */
export function AppLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <ScrollToTop />
      {/* Keyboard users can jump straight to content, skipping the nav. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-primary-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
