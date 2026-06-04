import { api } from '@/shared/lib/axios'
import { LINKS_ENDPOINTS } from './links.endpoints'
import type { LinkResponse, LinkCreateRequest } from './links.types'

export const linksApi = {
  getAll: (): Promise<LinkResponse[]> =>
    api.get(LINKS_ENDPOINTS.userLinks).then((r) => r.data),

  create: (dto: LinkCreateRequest): Promise<LinkResponse> =>
    api.post(LINKS_ENDPOINTS.userLinks, dto).then((r) => r.data),

  delete: (linkId: number): Promise<void> =>
    api.delete(LINKS_ENDPOINTS.deleteUserLink(linkId)).then((r) => r.data),
}
