import { SERVICES } from '@/shared/constants/services'

export const BUSINESS_SIMULATION_ENDPOINTS = {
  programs: `${SERVICES.businessSimulation}/program/`,
  program: (id: number) => `${SERVICES.businessSimulation}/program/${id}`,
  categories: `${SERVICES.businessSimulation}/program/categories`,
  phasesByProgram: (programId: number) => `${SERVICES.businessSimulation}/phase/program/${programId}`,
  assignmentsByPhase: (phaseId: number) => `${SERVICES.businessSimulation}/assigment/phase/${phaseId}`,
  mentorsByProgram: (programId: number) => `${SERVICES.businessSimulation}/mentor/program/${programId}`,
  cohortsByProgram: (programId: number) => `${SERVICES.businessSimulation}/program/${programId}/cohorts`,
  enrollments: `${SERVICES.businessSimulation}/enrollment/`,
  myEnrollments: `${SERVICES.businessSimulation}/enrollment/my`,
  enrollmentsByProgram: (programId: number) => `${SERVICES.businessSimulation}/enrollment/program/${programId}`,
} as const
