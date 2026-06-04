import { useQuery } from '@tanstack/react-query'
import { lookupApi } from '@/shared/api/lookup'
import { LOOKUP_QUERY_KEYS } from '@/shared/constants/query-keys'

export function useSkills() {
  return useQuery({
    queryKey: LOOKUP_QUERY_KEYS.skills,
    queryFn: lookupApi.getSkills,
    staleTime: Infinity,
  })
}
