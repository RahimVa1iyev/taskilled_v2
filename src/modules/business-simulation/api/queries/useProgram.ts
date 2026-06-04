import { useQuery } from '@tanstack/react-query'
import { programApi } from '@/modules/business-simulation/api/program.api'
import { programKeys } from '@/modules/business-simulation/api/program.keys'

export function useProgram(id: number) {
  return useQuery({
    queryKey: programKeys.detail(id),
    queryFn: () => programApi.getProgram(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  })
}
