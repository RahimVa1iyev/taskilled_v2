import { useMutation, useQuery } from '@tanstack/react-query'

import { api } from '@/shared/lib/axios'
import { queryClient } from '@/shared/lib/query-client'
import type {
  UserLanguageRequest,
  UserLanguageResponse,
} from '@/modules/profile/types/profile.types'
import { PROFILE_ENDPOINTS } from './profile.endpoints'
import { PROFILE_QUERY_KEYS } from './profile.keys'

// ─── HTTP functions ──────────────────────────────────────────────────────────

export const languagesApi = {
  getUserLanguages: (): Promise<UserLanguageResponse[]> =>
    api.get(PROFILE_ENDPOINTS.languages).then((r) =>
      r.data.map((l: UserLanguageResponse) => ({
        ...l,
        languageLevel: l.languageLevel ?? l.level ?? '',
      }))
    ),

  bulkAddLanguages: (languages: UserLanguageRequest[]): Promise<UserLanguageResponse[]> =>
    api.post(PROFILE_ENDPOINTS.bulkLanguages, { languages }).then((r) => r.data),

  deleteUserLanguage: (language: number): Promise<void> =>
    api.delete(PROFILE_ENDPOINTS.deleteLanguage(language)).then(() => undefined),
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

export function useLanguagesQuery() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.languages,
    queryFn: languagesApi.getUserLanguages,
    staleTime: 5 * 60 * 1000,
  })
}

export function useBulkAddLanguagesMutation() {
  return useMutation({
    mutationFn: languagesApi.bulkAddLanguages,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.languages }),
  })
}

export function useDeleteLanguageMutation() {
  return useMutation({
    mutationFn: languagesApi.deleteUserLanguage,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.languages }),
  })
}
