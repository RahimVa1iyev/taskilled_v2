import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { useNavigate, useLocation } from 'react-router-dom'

import { useResetPassword } from '@/modules/auth/api/mutations/useResetPassword'
import { resetPasswordSchema, type ResetPasswordFormData } from '@/modules/auth/types/reset-password.schema'
import { ROUTES } from '@/shared/constants/routes'
import { toast } from '@/shared/lib/toast'

interface UseResetPasswordFormResult {
  form: UseFormReturn<ResetPasswordFormData>
  onSubmit: (data: ResetPasswordFormData) => Promise<void>
}

export function useResetPasswordForm(): UseResetPasswordFormResult {
  const location = useLocation()
  const navigate = useNavigate()
  const { mutateAsync: resetPassword } = useResetPassword()

  const token =
    typeof (location.state as { token?: unknown } | null)?.token === 'string'
      ? (location.state as { token: string }).token
      : null


  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onTouched',
    defaultValues: { password: '', confirmPassword: '' },
  })

  async function onSubmit(data: ResetPasswordFormData): Promise<void> {
    if (!token) {
      toast.error('Session expired. Please start again.')
      navigate(ROUTES.AUTH.FORGOT_PASSWORD, { replace: true })
      return
    }
    await resetPassword({
      token,
      dto: { password: data.password, repeatPassword: data.confirmPassword },
    })
  }

  return { form, onSubmit }
}
