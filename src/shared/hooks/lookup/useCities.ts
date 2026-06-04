import { useQuery } from '@tanstack/react-query'
import { lookupApi } from '@/shared/api/lookup'
import { LOOKUP_QUERY_KEYS } from '@/shared/constants/query-keys'

export function useCities(countryId: number | null | undefined) {
  return useQuery({
    queryKey: LOOKUP_QUERY_KEYS.cities(countryId ?? 0),
    queryFn: () => lookupApi.getCities(countryId!),
    enabled: countryId != null,
    staleTime: Infinity,
  })
}
