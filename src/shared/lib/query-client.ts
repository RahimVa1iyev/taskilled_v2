import { QueryCache, QueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import { toast } from '@/shared/lib/toast'

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      const status = (error as AxiosError)?.response?.status
      if (status === 401) return
      toast.apiError(error)
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error) => {
        const msg = (error as { response?: { data?: { message?: unknown } } }).response?.data
          ?.message
        // Structured error codes are handled by the mutation's own onError — skip global toast
        if (typeof msg === 'object' && msg !== null && 'errorCode' in (msg as object)) return
        toast.apiError(error)
      },
    },
  },
})
