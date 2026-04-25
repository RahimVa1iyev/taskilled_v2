import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ThemeMode = 'light' | 'dark' | 'system'

interface UiState {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'ui-store', partialize: (s) => ({ theme: s.theme }) }
  )
)

