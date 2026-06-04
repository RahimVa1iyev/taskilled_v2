import { useQuery } from '@tanstack/react-query'
import { programApi } from '@/modules/business-simulation/api/program.api'
import { programKeys } from '@/modules/business-simulation/api/program.keys'

export function useEnrollmentsByProgram(programId: number) {
  return useQuery({
    queryKey: programKeys.enrollmentsByProgram(programId),
    queryFn: () => programApi.getEnrollmentsByProgram(programId),
    enabled: !!programId,
    staleTime: 2 * 60 * 1000,
  })
}
