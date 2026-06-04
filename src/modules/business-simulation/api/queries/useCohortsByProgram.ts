import { useQuery } from '@tanstack/react-query'
import { programApi } from '@/modules/business-simulation/api/program.api'
import { programKeys } from '@/modules/business-simulation/api/program.keys'

export function useCohortsByProgram(programId: number) {
  return useQuery({
    queryKey: programKeys.cohorts(programId),
    queryFn: () => programApi.listCohortsByProgram(programId),
    staleTime: 5 * 60 * 1000,
    enabled: !!programId,
  })
}
