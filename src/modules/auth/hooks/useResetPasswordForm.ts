import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/shared/constants/routes'
import { resetPasswordSchema, type ResetPasswordFormData } from '@/modules/auth/types/reset-password.schema'

interface UseResetPasswordFormResult {
  form: UseFormReturn<ResetPasswordFormData>
  isDone: boolean
  onSubmit: (data: ResetPasswordFormData) => Promise<void>
}

export function useResetPasswordForm(): UseResetPasswordFormResult {
  const navigate = useNavigate()
  const [isDone, setIsDone] = useState(false)

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  async function onSubmit(_: ResetPasswordFormData): Promise<void> {
    await new Promise((r) => setTimeout(r, 700))
    setIsDone(true)
    setTimeout(() => navigate(ROUTES.AUTH.LOGIN), 1200)
  }

  return { form, isDone, onSubmit }
}

