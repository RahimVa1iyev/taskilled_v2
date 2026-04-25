import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/shared/constants/routes'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/modules/auth/types/forgot-password.schema'

interface UseForgotPasswordFormResult {
  form: UseFormReturn<ForgotPasswordFormData>
  onSubmit: (data: ForgotPasswordFormData) => Promise<void>
}

export function useForgotPasswordForm(): UseForgotPasswordFormResult {
  const navigate = useNavigate()

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit(data: ForgotPasswordFormData): Promise<void> {
    await new Promise((r) => setTimeout(r, 600))
    navigate(ROUTES.AUTH.VERIFY, { state: { reason: 'passwordReset', email: data.email } })
  }

  return { form, onSubmit }
}

