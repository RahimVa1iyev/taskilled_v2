import { useQuery } from '@tanstack/react-query'
import { programApi } from '@/modules/business-simulation/api/program.api'
import { programKeys } from '@/modules/business-simulation/api/program.keys'

export function useMyEnrollments() {
  return useQuery({
    queryKey: programKeys.myEnrollments(),
    queryFn: () => programApi.getMyEnrollments(),
    staleTime: 2 * 60 * 1000,
  })
}
