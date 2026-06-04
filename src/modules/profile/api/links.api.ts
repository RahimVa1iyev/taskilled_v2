import { useMutation, useQuery } from '@tanstack/react-query'

import { api } from '@/shared/lib/axios'
import { queryClient } from '@/shared/lib/query-client'
import type { LinkCreateRequest, LinkResponse } from '@/modules/profile/types/profile.types'
import { PROFILE_ENDPOINTS } from './profile.endpoints'
import { PROFILE_QUERY_KEYS } from './profile.keys'

// ─── HTTP functions ──────────────────────────────────────────────────────────

export const linksApi = {
  getLinks: (): Promise<LinkResponse[]> =>
    api.get(PROFILE_ENDPOINTS.links).then((r) => r.data),

  createLink: (dto: LinkCreateRequest): Promise<LinkResponse> =>
    api.post(PROFILE_ENDPOINTS.links, dto).then((r) => r.data),

  deleteLink: (id: number): Promise<void> =>
    api.delete(PROFILE_ENDPOINTS.deleteLink(id)).then(() => undefined),
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

export function useLinksQuery() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.links,
    queryFn: linksApi.getLinks,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateLinkMutation() {
  return useMutation({
    mutationFn: linksApi.createLink,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.links }),
  })
}

export function useDeleteLinkMutation() {
  return useMutation({
    mutationFn: linksApi.deleteLink,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.links }),
  })
}
