import { QueryCache, QueryClient } from '@tanstack/react-query'

import { toast } from '@/shared/lib/toast'

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
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
        toast.apiError(error)
      },
    },
  },
})

