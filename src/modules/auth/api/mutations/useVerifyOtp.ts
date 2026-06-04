import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { authApi } from '@/modules/auth/api/auth.api'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import type { OtpFlow, OtpVerifyDto } from '@/modules/auth/types/auth.types'
import { ROUTES } from '@/shared/constants/routes'
import { toast } from '@/shared/lib/toast'

interface VerifyOtpVariables extends OtpVerifyDto {
  flow: OtpFlow
}

export function useVerifyOtp() {
  const navigate = useNavigate()
  const setAccessToken = useAuthStore((s) => s.setAccessToken)

  return useMutation({
    mutationFn: ({ email, otp }: VerifyOtpVariables) => authApi.verifyOtp({ email, otp }),
    onSuccess: (response, { flow }) => {
      toast.apiSuccess(response)

      if (flow === 'forgot-password') {
        navigate(ROUTES.AUTH.RESET_PASSWORD, { state: { token: response.data.accessToken } })
        return
      }

      setAccessToken(response.data.accessToken, response.data.refreshToken)
    },
  })
}
