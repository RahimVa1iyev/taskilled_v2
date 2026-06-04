import { useQuery } from '@tanstack/react-query'

import { programApi } from '@/modules/business-simulation/api/program.api'
import { programKeys } from '@/modules/business-simulation/api/program.keys'

export function useCategories() {
  return useQuery({
    queryKey: programKeys.categories(),
    queryFn: () => programApi.listCategories(),
    staleTime: 10 * 60 * 1000,
  })
}
