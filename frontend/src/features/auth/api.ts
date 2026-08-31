import { api } from '@/lib/apiClient'
import type { AuthResponse, Role, User } from '@/types/api'

export interface SignupPayload {
  name: string
  email: string
  password: string
  roles?: Role[]
}

export interface LoginPayload {
  email: string
  password: string
}

export const authApi = {
  signup: (payload: SignupPayload) => api.post<AuthResponse>('/auth/signup', payload),
  login: (payload: LoginPayload) => api.post<AuthResponse>('/auth/login', payload),
  me: () => api.get<User>('/auth/me'),
}
