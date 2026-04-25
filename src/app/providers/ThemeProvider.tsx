import { useEffect } from 'react'

import { useThemeMode } from '@/shared/store/ui.selectors'

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps): React.JSX.Element {
  const theme = useThemeMode()

  useEffect(() => {
    const root = document.documentElement

    if (theme === 'system') {
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
      root.classList.toggle('dark', prefersDark)
      return
    }

    root.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return <>{children}</>
}

