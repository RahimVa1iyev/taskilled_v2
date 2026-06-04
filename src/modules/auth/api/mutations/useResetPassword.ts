import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { authApi } from '@/modules/auth/api/auth.api'
import type { ResetPasswordDto } from '@/modules/auth/types/auth.types'
import { ROUTES } from '@/shared/constants/routes'
import { toast } from '@/shared/lib/toast'

export function useResetPassword() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({ token, dto }: { token: string; dto: ResetPasswordDto }) =>
      authApi.resetPassword(token, dto),
    onSuccess: (response) => {
      toast.apiSuccess(response)
      navigate(ROUTES.AUTH.LOGIN, { replace: true })
    },
  })
}
