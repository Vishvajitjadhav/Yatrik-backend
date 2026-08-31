import { useMutation } from '@tanstack/react-query'
import { authApi, type LoginPayload, type SignupPayload } from './api'
import { useAuthStore } from '@/stores/authStore'
import { toast } from '@/stores/toastStore'
import { ApiClientError } from '@/lib/apiClient'

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth)
  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (auth) => {
      setAuth(auth)
      toast.success(`Welcome back, ${auth.user.name}!`)
    },
    onError: (error) => {
      toast.error(error instanceof ApiClientError ? error.message : 'Login failed')
    },
  })
}

export function useSignup() {
  const setAuth = useAuthStore((s) => s.setAuth)
  return useMutation({
    mutationFn: (payload: SignupPayload) => authApi.signup(payload),
    onSuccess: (auth) => {
      setAuth(auth)
      toast.success(`Welcome to YATRIK, ${auth.user.name}!`)
    },
    onError: (error) => {
      toast.error(error instanceof ApiClientError ? error.message : 'Sign up failed')
    },
  })
}
