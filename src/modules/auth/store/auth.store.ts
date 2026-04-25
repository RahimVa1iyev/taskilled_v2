import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  accessToken: string | null
  isAuthenticated: boolean
  setAccessToken: (token: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      isAuthenticated: false,
      setAccessToken: (token) =>
        set({ accessToken: token, isAuthenticated: Boolean(token) }),
      logout: () => set({ accessToken: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-store',
      partialize: (s) => ({ accessToken: s.accessToken }),
    }
  )
)

