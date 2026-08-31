import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/brand/Logo'

interface AuthShellProps {
  title: string
  subtitle?: string
  children: ReactNode
}

/** Two-column auth layout: brand panel (desktop) + form card. */
export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="flex min-h-svh">
      {/* Brand panel — hidden on small screens */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-primary-500 p-12 text-white lg:flex">
        <Link to="/">
          <Logo reversed size={34} />
        </Link>
        <div>
          <h2 className="text-4xl font-bold leading-tight text-white">
            Stays that feel like <br /> you never left home.
          </h2>
          <p className="mt-4 max-w-md text-primary-50">
            Discover and book hotels across the country — the traveler's way.
          </p>
        </div>
        <p className="text-sm text-primary-100">© {new Date().getFullYear()} YATRIK</p>
      </div>

      {/* Form side */}
      <div className="flex w-full items-center justify-center px-4 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link to="/">
              <Logo size={32} />
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-ink-900">{title}</h1>
          {subtitle && <p className="mt-2 text-ink-500">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  )
}
