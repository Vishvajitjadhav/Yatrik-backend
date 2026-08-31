import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import type { Role } from '@/types/api'

interface ProtectedRouteProps {
  children: ReactNode
  /** If set, the user must have this role; otherwise they're sent home. */
  role?: Role
}

/** Gate for authenticated (and optionally role-restricted) routes. */
export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const location = useLocation()
  const token = useAuthStore((s) => s.token)
  const hasRole = useAuthStore((s) => (role ? s.hasRole(role) : true))

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  if (role && !hasRole) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}
