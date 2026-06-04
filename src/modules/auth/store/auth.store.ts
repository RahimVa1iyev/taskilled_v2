import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { UserProfile } from '@/modules/auth/types/auth.types'
import { clearCompany } from '@/modules/auth/store/company.store'
import { resetOnboardingStore } from '@/features/onboarding/store/onboarding.store'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: UserProfile | null
  isInitialized: boolean
  setAccessToken: (accessToken: string | null, refreshToken?: string | null) => void
  setUser: (user: UserProfile | null) => void
  setInitialized: () => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isInitialized: false,
      setAccessToken: (accessToken, refreshToken = null) =>
        set({ accessToken, refreshToken }),
      setUser: (user) => set({ user }),
      setInitialized: () => set({ isInitialized: true }),
      clearAuth: () => {
        set({ accessToken: null, refreshToken: null, user: null, isInitialized: false })
        clearCompany()
        resetOnboardingStore()
      },
    }),
    {
      name: 'auth-store',
      partialize: (s) => ({
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
        user: s.user,
      }),
    }
  )
)

export function clearAuth(): void {
  useAuthStore.getState().clearAuth()
}

export function setInitialized(): void {
  useAuthStore.getState().setInitialized()
}
