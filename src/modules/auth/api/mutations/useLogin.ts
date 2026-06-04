import { isAxiosError } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { authApi } from '@/modules/auth/api/auth.api'
import { authKeys } from '@/modules/auth/api/auth.keys'
import { useResendOtp } from '@/modules/auth/api/mutations/useResendOtp'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import type { LoginDto } from '@/modules/auth/types/auth.types'
import { ROUTES } from '@/shared/constants/routes'
import { toast } from '@/shared/lib/toast'

export function useLogin() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setAccessToken = useAuthStore((s) => s.setAccessToken)
  const { mutateAsync: resendOtp } = useResendOtp()

  return useMutation({
    mutationFn: (dto: LoginDto) => authApi.login(dto),
    onSuccess: async (response) => {
      setAccessToken(response.data.accessToken, response.data.refreshToken)
      toast.apiSuccess(response)
      try {
        const userData = await queryClient.fetchQuery({
          queryKey: authKeys.me(),
          queryFn: authApi.me,
        })
        useAuthStore.getState().setUser(userData)
      } catch (error) {
        toast.apiError(error)
      }
    },
    onError: async (error, variables) => {
      const msg = isAxiosError(error)
        ? (error.response?.data as { message?: unknown } | undefined)?.message
        : undefined

      if (typeof msg === 'object' && msg !== null && 'errorCode' in (msg as object)) {
        toast.warning('Hesabınız təsdiqlənməyib. Email-inizə OTP göndərilir...')
        try {
          await resendOtp({ email: variables.email })
          navigate(ROUTES.AUTH.VERIFY, { state: { flow: 'login', email: variables.email } })
        } catch (resendError) {
          toast.apiError(resendError)
        }
        return
      }

      toast.apiError(error)
    },
  })
}
