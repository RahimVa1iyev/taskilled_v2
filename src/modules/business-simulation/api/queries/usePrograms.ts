import { useQuery } from '@tanstack/react-query'

import { programApi } from '@/modules/business-simulation/api/program.api'
import { programKeys } from '@/modules/business-simulation/api/program.keys'
import type { ListProgramsParams } from '@/modules/business-simulation/types/program.types'

export function usePrograms(params?: ListProgramsParams) {
  return useQuery({
    queryKey: programKeys.list(params),
    queryFn: () => programApi.listPrograms(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}
