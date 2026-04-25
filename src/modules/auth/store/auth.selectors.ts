import { useAuthStore } from './auth.store'

export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated)
export const useAccessToken = () => useAuthStore((s) => s.accessToken)

