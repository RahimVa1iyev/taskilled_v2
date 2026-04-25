import { useQuery } from '@tanstack/react-query'

import { authApi } from '@/modules/auth/api/auth.api'
import { authKeys } from '@/modules/auth/api/auth.keys'
import { useIsAuthenticated } from '@/modules/auth/store/auth.selectors'

export function useMe() {
  const isAuthenticated = useIsAuthenticated()

  return useQuery({
    queryKey: authKeys.me(),
    queryFn: authApi.me,
    enabled: isAuthenticated,
  })
}

