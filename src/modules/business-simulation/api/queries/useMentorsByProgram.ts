import { useQuery } from '@tanstack/react-query'
import { programApi } from '@/modules/business-simulation/api/program.api'
import { programKeys } from '@/modules/business-simulation/api/program.keys'

export function useMentorsByProgram(programId: number) {
  return useQuery({
    queryKey: programKeys.mentors(programId),
    queryFn: () => programApi.listMentorsByProgram(programId),
    staleTime: 5 * 60 * 1000,
    enabled: !!programId,
  })
}
