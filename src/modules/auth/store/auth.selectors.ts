import { useAuthStore } from './auth.store'

// Modul səviyyəsində sabit — null/undefined fallback üçün stabil referans
const EMPTY_FIELDS: string[] = []

export const useIsAuthenticated = () => Boolean(useAuthStore((s) => s.accessToken))
export const useAccessToken = () => useAuthStore((s) => s.accessToken)
export const useUser = () => useAuthStore((s) => s.user)
export const useIsInitialized = () => useAuthStore((s) => s.isInitialized)

// EMPTY_FIELDS — hər render-də eyni referans, infinite loop yoxdur
export const useRequiredFields = () =>
  useAuthStore((s) => s.user?.requiredFields ?? EMPTY_FIELDS)

export const useUserRole = () =>
  useAuthStore((s) => s.user?.role?.name ?? null)
