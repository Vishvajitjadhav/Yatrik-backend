import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AUTH_STORAGE_KEY } from '@/lib/constants'
import type { AuthResponse, Role, User } from '@/types/api'

interface AuthState {
  token: string | null
  user: User | null
  /** Store credentials after a successful login/signup. */
  setAuth: (auth: AuthResponse) => void
  /** Clear credentials (logout or 401). */
  logout: () => void
  isAuthenticated: () => boolean
  hasRole: (role: Role) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setAuth: ({ token, user }) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      isAuthenticated: () => Boolean(get().token),
      hasRole: (role) => Boolean(get().user?.roles?.includes(role)),
    }),
    {
      name: AUTH_STORAGE_KEY,
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
)
