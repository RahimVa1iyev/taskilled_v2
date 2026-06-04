import { useQuery } from '@tanstack/react-query'
import { programApi } from '@/modules/business-simulation/api/program.api'
import { programKeys } from '@/modules/business-simulation/api/program.keys'

export function usePhasesByProgram(programId: number) {
  return useQuery({
    queryKey: programKeys.phases(programId),
    queryFn: () => programApi.listPhasesByProgram(programId),
    staleTime: 5 * 60 * 1000,
    enabled: !!programId,
  })
}
