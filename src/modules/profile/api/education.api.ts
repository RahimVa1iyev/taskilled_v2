import { useMutation, useQuery } from '@tanstack/react-query'

import { api } from '@/shared/lib/axios'
import { queryClient } from '@/shared/lib/query-client'
import type { EducationRequest, EducationResponse } from '@/modules/profile/types/profile.types'
import { PROFILE_ENDPOINTS } from './profile.endpoints'
import { PROFILE_QUERY_KEYS } from './profile.keys'

// ─── HTTP functions ──────────────────────────────────────────────────────────

export const educationApi = {
  getEducations: (): Promise<EducationResponse[]> =>
    api.get(PROFILE_ENDPOINTS.educations).then((r) =>
      r.data.map((e: EducationResponse) => ({
        ...e,
        schoolName: e.schoolName ?? e.school_name ?? '',
        fieldOfStudy: e.fieldOfStudy ?? e.field_of_study ?? null,
        startDate: e.startDate ?? e.start_date ?? null,
        endDate: e.endDate ?? e.end_date ?? null,
      }))
    ),

  createEducation: (dto: EducationRequest): Promise<EducationResponse> =>
    api.post(PROFILE_ENDPOINTS.educations, [dto]).then((r) => r.data),

  deleteEducation: (id: number): Promise<void> =>
    api.delete(PROFILE_ENDPOINTS.deleteEducation(id)).then(() => undefined),
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

export function useEducationQuery() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.educations,
    queryFn: educationApi.getEducations,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateEducationMutation() {
  return useMutation({
    mutationFn: educationApi.createEducation,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.educations }),
  })
}

export function useDeleteEducationMutation() {
  return useMutation({
    mutationFn: educationApi.deleteEducation,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.educations }),
  })
}
