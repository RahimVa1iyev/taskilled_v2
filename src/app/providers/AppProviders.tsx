import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { I18nextProvider } from 'react-i18next'
import { Toaster } from 'sonner'

import { ThemeProvider } from '@/app/providers/ThemeProvider'
import { i18n } from '@/shared/i18n/i18n'
import { queryClient } from '@/shared/lib/query-client'
import { registerTokenProvider } from '@/shared/lib/token-provider'
import { useAuthStore } from '@/modules/auth'

interface AppProvidersProps {
  children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps): React.JSX.Element {
  registerTokenProvider({ getToken: () => useAuthStore.getState().accessToken })

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          {children}
          <Toaster richColors />
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </I18nextProvider>
  )
}

