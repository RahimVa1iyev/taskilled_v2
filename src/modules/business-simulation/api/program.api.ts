import { api } from '@/shared/lib/axios'
import { BUSINESS_SIMULATION_ENDPOINTS } from '@/modules/business-simulation/constants/business-simulation.endpoints'
import type {
  AssignmentResponse,
  CohortResponse,
  EnrollmentCreateParams,
  EnrollmentResponse,
  ListProgramsParams,
  MentorResponse,
  PaginatedResponse,
  PhaseResponse,
  ProgramCategoryResponse,
  ProgramResponse,
} from '@/modules/business-simulation/types/program.types'

export const programApi = {
  // ── Programs ─────────────────────────────────────────────────────────────────

  listPrograms: (params?: ListProgramsParams): Promise<PaginatedResponse<ProgramResponse>> => {
    const queryParams: Record<string, string | number | boolean> = {}

    if (params?.page) queryParams.page = params.page
    if (params?.page_size) queryParams.page_size = params.page_size
    if (params?.categoryId != null) queryParams.category_id = params.categoryId
    if (params?.status != null && params.status !== '') queryParams.status = params.status
    if (params?.hasMentor != null) queryParams.has_mentor = params.hasMentor
    if (params?.hasCohort != null) queryParams.has_cohort = params.hasCohort
    if (params?.currency != null && params.currency !== '') queryParams.currency = params.currency.toLowerCase()
    if (params?.companyId != null) queryParams.company_id = params.companyId
    if (params?.search != null && params.search !== '') queryParams.search = params.search

    return api
      .get(BUSINESS_SIMULATION_ENDPOINTS.programs, { params: queryParams })
      .then((r) => r.data)
  },

  getProgram: (id: number): Promise<ProgramResponse> =>
    api.get(BUSINESS_SIMULATION_ENDPOINTS.program(id)).then((r) => r.data),

  listCategories: (): Promise<ProgramCategoryResponse[]> =>
    api.get(BUSINESS_SIMULATION_ENDPOINTS.categories).then((r) => r.data),

  // ── Phases ───────────────────────────────────────────────────────────────────

  listPhasesByProgram: (programId: number): Promise<PhaseResponse[]> =>
    api.get(BUSINESS_SIMULATION_ENDPOINTS.phasesByProgram(programId)).then((r) => r.data),

  // ── Assignments ───────────────────────────────────────────────────────────────

  listAssignmentsByPhase: (phaseId: number): Promise<AssignmentResponse[]> =>
    api.get(BUSINESS_SIMULATION_ENDPOINTS.assignmentsByPhase(phaseId)).then((r) => r.data),

  // ── Mentors ───────────────────────────────────────────────────────────────────

  listMentorsByProgram: (programId: number): Promise<MentorResponse[]> =>
    api.get(BUSINESS_SIMULATION_ENDPOINTS.mentorsByProgram(programId))
      .then((r) => r.data)
      .catch((err) => {
        if (err.response?.status === 403) return []
        throw err
      }),

  // ── Cohorts ───────────────────────────────────────────────────────────────────

  listCohortsByProgram: (programId: number): Promise<CohortResponse[]> =>
    api.get(BUSINESS_SIMULATION_ENDPOINTS.cohortsByProgram(programId)).then((r) => r.data),

  // ── Enrollment ────────────────────────────────────────────────────────────────

  enroll: (params: EnrollmentCreateParams): Promise<EnrollmentResponse> =>
    api.post(BUSINESS_SIMULATION_ENDPOINTS.enrollments, params).then((r) => r.data),

  getMyEnrollments: (): Promise<EnrollmentResponse[]> =>
    api.get(BUSINESS_SIMULATION_ENDPOINTS.myEnrollments).then((r) => r.data),

  getEnrollmentsByProgram: (programId: number): Promise<EnrollmentResponse[]> =>
    api.get(BUSINESS_SIMULATION_ENDPOINTS.enrollmentsByProgram(programId)).then((r) => r.data),
}
