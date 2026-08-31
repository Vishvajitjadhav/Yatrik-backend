import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosInstance,
} from 'axios'
import { API_BASE_URL } from './constants'
import type { ApiEnvelope } from '@/types/api'
import { useAuthStore } from '@/stores/authStore'

/** Normalized error thrown by all API calls — carries a user-safe message. */
export class ApiClientError extends Error {
  status: number
  subErrors: string[]

  constructor(message: string, status: number, subErrors: string[] = []) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
    this.subErrors = subErrors
  }
}

const http: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach the JWT (read straight from the store — no React needed).
http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Normalize errors into ApiClientError; auto-logout on 401.
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiEnvelope<unknown>>) => {
    if (error.response) {
      const { status } = error.response
      const apiError =
        typeof error.response.data === 'object' ? error.response.data?.error : undefined

      if (status === 401) {
        useAuthStore.getState().logout()
      }

      // When the Vite proxy can't reach the backend it returns a bodyless 5xx
      // (no JSON envelope) — surface that as a clear "backend down" message.
      const backendUnreachable = !apiError && status >= 500
      const message = apiError?.message
        ? apiError.message
        : status === 401
          ? 'Your session has expired. Please sign in again.'
          : backendUnreachable
            ? 'Can’t reach the backend server. Make sure it is running on http://localhost:8080.'
            : 'Something went wrong. Please try again.'

      return Promise.reject(
        new ApiClientError(message, status, apiError?.subErrors ?? []),
      )
    }
    return Promise.reject(
      new ApiClientError(
        'Can’t reach the backend server. Make sure it is running on http://localhost:8080.',
        0,
      ),
    )
  },
)

/** Unwrap the `{ timeStamp, data, error }` envelope, returning `data` typed as T. */
function unwrap<T>(envelope: ApiEnvelope<T> | T): T {
  if (envelope && typeof envelope === 'object' && 'data' in envelope) {
    return (envelope as ApiEnvelope<T>).data as T
  }
  return envelope as T
}

export const api = {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await http.get<ApiEnvelope<T>>(url, config)
    return unwrap<T>(res.data)
  },
  async post<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const res = await http.post<ApiEnvelope<T>>(url, body, config)
    return unwrap<T>(res.data)
  },
  async put<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const res = await http.put<ApiEnvelope<T>>(url, body, config)
    return unwrap<T>(res.data)
  },
  async patch<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const res = await http.patch<ApiEnvelope<T>>(url, body, config)
    return unwrap<T>(res.data)
  },
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await http.delete<ApiEnvelope<T>>(url, config)
    return unwrap<T>(res.data)
  },
}

export { http }
