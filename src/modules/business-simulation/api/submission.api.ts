import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/shared/lib/axios'
import type {
  SubmissionResponse,
  SubmissionCreate,
  SubmissionBlockResponse,
  SubmissionBlockCreate,
  SubmissionCommentResponse,
  SubmissionCommentCreate,
} from '../types/program.types'

export const SUBMISSION_KEYS = {
  all: ['submissions'] as const,
  byEnrollment: (enrollmentId: number) => [...SUBMISSION_KEYS.all, 'enrollment', enrollmentId] as const,
  detail: (id: number) => [...SUBMISSION_KEYS.all, 'detail', id] as const,
  blocks: (submissionId: number) => [...SUBMISSION_KEYS.detail(submissionId), 'blocks'] as const,
  comments: (submissionId: number) => [...SUBMISSION_KEYS.detail(submissionId), 'comments'] as const,
}

const submissionService = {
  create: async (data: SubmissionCreate): Promise<SubmissionResponse> => {
    const payload = {
      assigment_id: data.assigmentId,
      enrollment_id: data.enrollmentId
    }
    console.log("🚀 Yaratmaq istədiyimiz Submission Payload-u:", payload)
    
    const res = await api.post<SubmissionResponse>('/business_simulation_ms/api/v1/submission/', payload)
    return res.data
  },

  getByEnrollment: async (enrollmentId: number): Promise<SubmissionResponse[]> => {
    return api.get<SubmissionResponse[]>(`/business_simulation_ms/api/v1/submission/enrollment/${enrollmentId}`)
      .then(res => res.data)
      .catch(err => {
        if (err.response?.status === 403 || err.response?.status === 404) return []
        throw err
      })
  },

  submit: async (submissionId: number): Promise<SubmissionResponse> => {
    const res = await api.patch<SubmissionResponse>(`/business_simulation_ms/api/v1/submission/${submissionId}/submit`)
    return res.data
  },

  // Blocks
  getBlocks: async (submissionId: number): Promise<SubmissionBlockResponse[]> => {
    const res = await api.get<SubmissionBlockResponse[]>(`/business_simulation_ms/api/v1/submission/${submissionId}/blocks`)
    return res.data
  },

  createBlock: async ({ submissionId, data }: { submissionId: number, data: SubmissionBlockCreate }): Promise<SubmissionBlockResponse> => {
    const res = await api.post<SubmissionBlockResponse>(`/business_simulation_ms/api/v1/submission/${submissionId}/blocks`, {
      block_type: data.blockType,
      content: data.content,
      order_index: data.orderIndex
    })
    return res.data
  },

  // Comments
  getComments: async (submissionId: number): Promise<SubmissionCommentResponse[]> => {
    const res = await api.get<SubmissionCommentResponse[]>(`/business_simulation_ms/api/v1/submission/${submissionId}/comments`)
    return res.data
  },

  createComment: async ({ submissionId, data }: { submissionId: number, data: SubmissionCommentCreate }): Promise<SubmissionCommentResponse> => {
    const res = await api.post<SubmissionCommentResponse>(`/business_simulation_ms/api/v1/submission/${submissionId}/comments`, data)
    return res.data
  }
}

// ── Hooks ──────────────────────────────────────────────────────────────────────

export function useSubmissionsByEnrollment(enrollmentId: number | undefined) {
  return useQuery({
    queryKey: SUBMISSION_KEYS.byEnrollment(enrollmentId!),
    queryFn: () => submissionService.getByEnrollment(enrollmentId!),
    enabled: !!enrollmentId,
  })
}

export function useCreateSubmission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: submissionService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBMISSION_KEYS.all })
    },
  })
}

export function useSubmitSubmission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: submissionService.submit,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SUBMISSION_KEYS.detail(data.id) })
      queryClient.invalidateQueries({ queryKey: SUBMISSION_KEYS.byEnrollment(data.enrollmentId) })
    },
  })
}

export function useSubmissionBlocks(submissionId: number | undefined) {
  return useQuery({
    queryKey: SUBMISSION_KEYS.blocks(submissionId!),
    queryFn: () => submissionService.getBlocks(submissionId!),
    enabled: !!submissionId,
  })
}

export function useCreateSubmissionBlock() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: submissionService.createBlock,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: SUBMISSION_KEYS.blocks(variables.submissionId) })
    },
  })
}

export function useSubmissionComments(submissionId: number | undefined) {
  return useQuery({
    queryKey: SUBMISSION_KEYS.comments(submissionId!),
    queryFn: () => submissionService.getComments(submissionId!),
    enabled: !!submissionId,
  })
}

export function useCreateSubmissionComment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: submissionService.createComment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: SUBMISSION_KEYS.comments(variables.submissionId) })
    },
  })
}
