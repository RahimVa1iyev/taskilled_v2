import { useMutation } from '@tanstack/react-query'

import { authApi } from '@/modules/auth/api/auth.api'
import type { ResendOtpDto } from '@/modules/auth/types/auth.types'
import { toast } from '@/shared/lib/toast'

export function useResendOtp() {
  return useMutation({
    mutationFn: (dto: ResendOtpDto) => authApi.resendOtp(dto),
    onSuccess: (response) => {
      toast.apiSuccess(response)
    },
  })
}
