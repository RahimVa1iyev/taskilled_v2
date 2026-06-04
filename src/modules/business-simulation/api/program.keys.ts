import type { ListProgramsParams } from '@/modules/business-simulation/types/program.types'

export const programKeys = {
  all: ['business-simulation', 'programs'] as const,
  list: (params?: ListProgramsParams) => [...programKeys.all, 'list', params] as const,
  detail: (id: number) => [...programKeys.all, 'detail', id] as const,
  categories: () => ['business-simulation', 'categories'] as const,
  phases: (programId: number) => ['business-simulation', 'phases', programId] as const,
  assignments: (phaseId: number) => ['business-simulation', 'assignments', phaseId] as const,
  mentors: (programId: number) => ['business-simulation', 'mentors', programId] as const,
  cohorts: (programId: number) => ['business-simulation', 'cohorts', programId] as const,
  myEnrollments: () => ['business-simulation', 'enrollments', 'my'] as const,
  enrollmentsByProgram: (programId: number) => ['business-simulation', 'enrollments', 'program', programId] as const,
}
