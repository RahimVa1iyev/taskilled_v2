export interface ProgramCategoryResponse {
  id: number
  name: string
}

export interface UserBriefResponse {
  id: number
  firstName: string | null
  lastName: string | null
  role: { id: number; name: string } | null
  gender: string | null
  imgUrl: string | null
  cvUrl: string | null
}

export interface ProgramResponse {
  id: number
  companyId: number
  userId: number
  title: string
  description: string
  categoryId: number
  category: ProgramCategoryResponse
  durationWeeks: number
  price: number
  currency: string
  hasMentor: boolean
  hasCohort: boolean
  status: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
  user: UserBriefResponse | null
}

export interface PaginatedResponse<T> {
  results: T[]
  totalCount: number
  currentPage: number
  pageSize: number
  totalPages: number
}

export interface ListProgramsParams {
  page?: number
  page_size?: number
  categoryId?: number | null
  status?: string | null
  hasMentor?: boolean | null
  hasCohort?: boolean | null
  currency?: string | null
  companyId?: number | null
  search?: string | null
}

// ── Phase ──────────────────────────────────────────────────────────────────────

export interface PhaseResponse {
  id: number
  programId: number
  title: string
  description: string
  orderIndex: number
  isPreview: boolean
}

// ── Assignment ────────────────────────────────────────────────────────────────

export type AssignmentAllowedType = 'text' | 'image' | 'video' | 'file' | 'link'

export interface AssignmentResponse {
  id: number
  phaseId: number
  title: string
  expectedOutcome: string | null
  difficultyLevel: string | null
  allowedTypes: AssignmentAllowedType[]
  orderIndex: number
}

// ── Mentor ────────────────────────────────────────────────────────────────────

export interface MentorResponse {
  id: number
  programId: number
  userId: number
  type: string
  invitedAt: string | null
  createdAt: string
  updatedAt: string | null
  user: UserBriefResponse | null
}

// ── Cohort ────────────────────────────────────────────────────────────────────

export interface CohortResponse {
  id: number
  programId: number
  title: string
  minSeats: number
  maxSeats: number | null
  applicationStartDate: string | null
  applicationEndDate: string | null
  startDate: string | null
  endDate: string | null
  status: string
  createdAt: string
  updatedAt: string | null
}

// ── Enrollment ────────────────────────────────────────────────────────────────

export interface EnrollmentResponse {
  id: number
  userId: string
  programId: number
  status: string
  motivationLetter: string | null
  cvUrl: string | null
  completedPhases: number
  completedTasks: number
  enrolledAt: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string | null
}

export interface EnrollmentCreateParams {
  programId: number
  motivationLetter?: string
  cvUrl?: string
}

// ── Submission ────────────────────────────────────────────────────────────────

export interface SubmissionResponse {
  id: number
  assigmentId: number
  enrollmentId: number
  status: string
  isLocked: boolean
  lockedAt: string | null
  isLate: boolean
  createdAt: string
  updatedAt: string | null
}

export interface SubmissionCreate {
  assigmentId: number
  enrollmentId: number
}

export interface SubmissionBlockResponse {
  id: number
  submissionId: number
  blockType: string
  content: string
  orderIndex: number
}

export interface SubmissionBlockCreate {
  blockType: string
  content: string
  orderIndex: number
}

export interface SubmissionCommentResponse {
  id: number
  submissionId: number
  userId: number
  userType: string
  body: string
  isRead: boolean
  createdAt: string
  updatedAt: string | null
}

export interface SubmissionCommentCreate {
  body: string
}

