import { useQueries } from '@tanstack/react-query'
import { programApi } from '@/modules/business-simulation/api/program.api'
import { programKeys } from '@/modules/business-simulation/api/program.keys'
import type { AssignmentResponse } from '@/modules/business-simulation/types/program.types'

/**
 * Fetches assignments for multiple phases in parallel.
 * Returns a map of phaseId → AssignmentResponse[]
 */
export function useAssignmentsByPhases(phaseIds: number[]) {
  const results = useQueries({
    queries: phaseIds.map((phaseId) => ({
      queryKey: programKeys.assignments(phaseId),
      queryFn: () => programApi.listAssignmentsByPhase(phaseId),
      staleTime: 5 * 60 * 1000,
      enabled: !!phaseId,
    })),
  })

  const assignmentsByPhase: Record<number, AssignmentResponse[]> = {}
  phaseIds.forEach((phaseId, i) => {
    assignmentsByPhase[phaseId] = results[i]?.data ?? []
  })

  const isLoading = results.some((r) => r.isLoading)

  return { assignmentsByPhase, isLoading }
}
