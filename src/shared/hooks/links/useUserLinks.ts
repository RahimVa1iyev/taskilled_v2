import { useQuery } from '@tanstack/react-query'
import { linksApi } from '@/shared/api/links'
import { LINKS_QUERY_KEYS } from '@/shared/constants/query-keys'

export function useUserLinks() {
  return useQuery({
    queryKey: LINKS_QUERY_KEYS.userLinks,
    queryFn: linksApi.getAll,
  })
}
