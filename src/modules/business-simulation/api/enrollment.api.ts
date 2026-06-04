import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/shared/lib/axios'
import { programKeys } from './program.keys'
import type { EnrollmentResponse, EnrollmentCreateParams, PaginatedResponse } from '../types/program.types'

export const ENROLLMENT_KEYS = {
  all: ['enrollments'] as const,
  my: () => [...ENROLLMENT_KEYS.all, 'my'] as const,
}

const enrollmentService = {
  create: async (data: EnrollmentCreateParams): Promise<EnrollmentResponse> => {
    const res = await api.post<EnrollmentResponse>('/business_simulation_ms/api/v1/enrollment/', {
      program_id: data.programId,
      motivation_letter: data.motivationLetter,
      cv_url: data.cvUrl
    })

    console.log('Data ',res.data)
    return res.data
  },

  getMyEnrollments: async (): Promise<PaginatedResponse<EnrollmentResponse>> => {
    const res = await api.get<PaginatedResponse<EnrollmentResponse>>('/business_simulation_ms/api/v1/enrollment/my')
    return res.data
  }
}

export function useMyEnrollments() {
  return useQuery({
    queryKey: ENROLLMENT_KEYS.my(),
    queryFn: enrollmentService.getMyEnrollments,
  })
}

export function useCreateEnrollment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: enrollmentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programKeys.myEnrollments() })
      queryClient.invalidateQueries({ queryKey: ENROLLMENT_KEYS.all })
    },
  })
}
