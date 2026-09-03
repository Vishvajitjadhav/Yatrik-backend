import { NavLink, Outlet } from 'react-router-dom'
import { Container } from '@/components/ui'
import { cn } from '@/lib/cn'

const tabs = [
  { to: '/manager', label: 'Overview', end: true },
  { to: '/manager/hotels', label: 'My hotels', end: false },
]

/** Shell for the hotel-manager area: a header + tabbed sub-navigation. */
export function ManagerLayout() {
  return (
    <div>
      <div className="border-b border-line bg-surface">
        <Container className="pt-6">
          <h1 className="text-2xl font-bold text-ink-900">Manager dashboard</h1>
          <p className="mt-1 text-sm text-ink-500">
            Manage your properties, rooms and availability.
          </p>
          <nav className="mt-4 flex gap-1">
            {tabs.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                end={t.end}
                className={({ isActive }) =>
                  cn(
                    '-mb-px border-b-2 px-4 py-3 text-sm font-semibold transition-colors',
                    isActive
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-ink-500 hover:text-ink-900',
                  )
                }
              >
                {t.label}
              </NavLink>
            ))}
          </nav>
        </Container>
      </div>

      <Outlet />
    </div>
  )
}
