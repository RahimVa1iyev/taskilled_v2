import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { authApi } from '@/modules/auth/api/auth.api'
import type { ForgotPasswordDto } from '@/modules/auth/types/auth.types'
import { ROUTES } from '@/shared/constants/routes'
import { toast } from '@/shared/lib/toast'

export function useForgotPassword() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (dto: ForgotPasswordDto) => authApi.forgotPassword(dto),
    onSuccess: (response, { email }) => {
      toast.apiSuccess(response)
      navigate(ROUTES.AUTH.VERIFY, { state: { flow: 'forgot-password', email } })
    },
  })
}
