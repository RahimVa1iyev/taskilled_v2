import { useQuery } from '@tanstack/react-query'
import { lookupApi } from '@/shared/api/lookup'
import { LOOKUP_QUERY_KEYS } from '@/shared/constants/query-keys'

export function useCountries() {
  return useQuery({
    queryKey: LOOKUP_QUERY_KEYS.countries,
    queryFn: lookupApi.getCountries,
    staleTime: Infinity,
  })
}
