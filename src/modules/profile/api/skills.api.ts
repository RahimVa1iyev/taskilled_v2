import { useMutation, useQuery } from '@tanstack/react-query'

import { api } from '@/shared/lib/axios'
import { queryClient } from '@/shared/lib/query-client'
import type { UserSkillRequest, UserSkillResponse } from '@/modules/profile/types/profile.types'
import { PROFILE_ENDPOINTS } from './profile.endpoints'
import { PROFILE_QUERY_KEYS } from './profile.keys'

// ─── HTTP functions ──────────────────────────────────────────────────────────

export const skillsApi = {
  getUserSkills: (): Promise<UserSkillResponse[]> =>
    api.get(PROFILE_ENDPOINTS.skills).then((r) =>
      r.data.map((s: UserSkillResponse) => ({
        ...s,
        name: s.name ?? s.nameEn ?? s.nameAz ?? '',
      }))
    ),

  setUserSkills: (skills: UserSkillRequest[]): Promise<UserSkillResponse[]> =>
    api.post(PROFILE_ENDPOINTS.skills, skills).then((r) => r.data),

  deleteUserSkill: (skillId: number): Promise<void> =>
    api.delete(PROFILE_ENDPOINTS.deleteSkill(skillId)).then(() => undefined),
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

export function useSkillsQuery() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.skills,
    queryFn: skillsApi.getUserSkills,
    staleTime: 5 * 60 * 1000,
  })
}

export function useSetSkillsMutation() {
  return useMutation({
    mutationFn: skillsApi.setUserSkills,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.skills }),
  })
}

export function useDeleteSkillMutation() {
  return useMutation({
    mutationFn: skillsApi.deleteUserSkill,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.skills }),
  })
}
