/** Backend base path. Dev uses Vite's proxy (see vite.config.ts) so a relative path works. */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1'

/** localStorage key for the persisted JWT + user (see stores/authStore). */
export const AUTH_STORAGE_KEY = 'yatrik.auth'
