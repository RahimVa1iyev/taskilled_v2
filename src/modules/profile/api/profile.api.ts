import { useMutation, useQuery } from '@tanstack/react-query'

import { api } from '@/shared/lib/axios'
import { queryClient } from '@/shared/lib/query-client'
import { authKeys } from '@/modules/auth/api/auth.keys'
import type { MeResponse } from '@/modules/auth/types/auth.types'
import type { ProfileUpdateRequest } from '@/modules/profile/types/profile.types'
import { PROFILE_ENDPOINTS } from './profile.endpoints'
import { PROFILE_QUERY_KEYS } from './profile.keys'

// ─── HTTP functions ──────────────────────────────────────────────────────────

export const profileApi = {
  getMe: (): Promise<MeResponse> =>
    api.get(PROFILE_ENDPOINTS.me).then((r) => r.data),

  updateMe: (dto: ProfileUpdateRequest): Promise<MeResponse> =>
    api.put(PROFILE_ENDPOINTS.me, dto).then((r) => r.data),
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

export function useProfileQuery() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.me,
    queryFn: profileApi.getMe,
    staleTime: 3 * 60 * 1000,
  })
}

export function useUpdateMeMutation() {
  return useMutation({
    mutationFn: profileApi.updateMe,
    onSuccess: () => {
      // Invalidate queries instead of manually setting to avoid empty response bugs
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.me })
      queryClient.invalidateQueries({ queryKey: authKeys.me() })
    },
  })
}
