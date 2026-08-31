import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '@/components/brand/Logo'
import { Avatar, Button, Container, Drawer, IconButton } from '@/components/ui'
import { useAuthStore } from '@/stores/authStore'
import { toast } from '@/stores/toastStore'

export function Navbar() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const isManager = useAuthStore((s) => s.hasRole('HOTEL_MANAGER'))
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    toast.info('You have been signed out.')
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link to="/" aria-label="YATRIK home">
          <Logo size={30} />
        </Link>

        {/* Desktop */}
        <nav className="hidden items-center gap-2 md:flex">
          <Link
            to="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-ink-700 hover:bg-bg"
          >
            Explore
          </Link>
          {isManager && (
            <Link
              to="/manager/hotels"
              className="rounded-md px-3 py-2 text-sm font-medium text-ink-700 hover:bg-bg"
            >
              My hotels
            </Link>
          )}
          {user ? (
            <>
              <Link
                to="/bookings"
                className="rounded-md px-3 py-2 text-sm font-medium text-ink-700 hover:bg-bg"
              >
                My trips
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-md px-3 py-2 text-sm font-medium text-ink-700 hover:bg-bg"
              >
                Sign out
              </button>
              <Avatar name={user.name} className="ml-1" />
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Sign in
              </Button>
              <Button size="sm" onClick={() => navigate('/signup')}>
                Sign up
              </Button>
            </>
          )}
        </nav>

        {/* Mobile trigger */}
        <div className="md:hidden">
          <IconButton label="Open menu" onClick={() => setMenuOpen(true)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </IconButton>
        </div>
      </Container>

      {/* Mobile drawer */}
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} title="Menu">
        <div className="flex flex-col gap-1">
          {user && (
            <div className="mb-2 flex items-center gap-3 border-b border-line pb-4">
              <Avatar name={user.name} />
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink-900">{user.name}</p>
                <p className="truncate text-sm text-ink-500">{user.email}</p>
              </div>
            </div>
          )}
          <MobileLink to="/" onClick={() => setMenuOpen(false)}>
            Explore
          </MobileLink>
          {isManager && (
            <MobileLink to="/manager/hotels" onClick={() => setMenuOpen(false)}>
              My hotels
            </MobileLink>
          )}
          {user ? (
            <>
              <MobileLink to="/bookings" onClick={() => setMenuOpen(false)}>
                My trips
              </MobileLink>
              <Button variant="outline" fullWidth className="mt-3" onClick={handleLogout}>
                Sign out
              </Button>
            </>
          ) : (
            <div className="mt-3 flex flex-col gap-2">
              <Button
                fullWidth
                onClick={() => {
                  setMenuOpen(false)
                  navigate('/login')
                }}
              >
                Sign in
              </Button>
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  setMenuOpen(false)
                  navigate('/signup')
                }}
              >
                Sign up
              </Button>
            </div>
          )}
        </div>
      </Drawer>
    </header>
  )
}

function MobileLink({
  to,
  onClick,
  children,
}: {
  to: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="rounded-md px-3 py-2.5 text-base font-medium text-ink-800 hover:bg-bg"
    >
      {children}
    </Link>
  )
}
