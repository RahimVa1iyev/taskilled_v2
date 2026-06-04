import { useMutation, useQuery } from '@tanstack/react-query'

import { api } from '@/shared/lib/axios'
import { queryClient } from '@/shared/lib/query-client'
import type { ExperienceRequest, ExperienceResponse } from '@/modules/profile/types/profile.types'
import { PROFILE_ENDPOINTS } from './profile.endpoints'
import { PROFILE_QUERY_KEYS } from './profile.keys'

// ─── HTTP functions ──────────────────────────────────────────────────────────

export const experienceApi = {
  getExperiences: (): Promise<ExperienceResponse[]> =>
    api.get(PROFILE_ENDPOINTS.experiences).then((r) =>
      r.data.map((e: ExperienceResponse) => ({
        ...e,
        startDate: e.startDate ?? e.start_date ?? '',
        endDate: e.endDate ?? e.end_date ?? null,
      }))
    ),

  createExperience: (dto: ExperienceRequest): Promise<ExperienceResponse> =>
    api.post(PROFILE_ENDPOINTS.experiences, [dto]).then((r) => r.data),

  deleteExperience: (id: number): Promise<void> =>
    api.delete(PROFILE_ENDPOINTS.deleteExperience(id)).then(() => undefined),
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

export function useExperienceQuery() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.experiences,
    queryFn: experienceApi.getExperiences,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateExperienceMutation() {
  return useMutation({
    mutationFn: experienceApi.createExperience,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.experiences }),
  })
}

export function useDeleteExperienceMutation() {
  return useMutation({
    mutationFn: experienceApi.deleteExperience,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.experiences }),
  })
}
