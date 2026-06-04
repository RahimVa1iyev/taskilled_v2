import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type UseFormReturn } from 'react-hook-form'

import { useForgotPassword } from '@/modules/auth/api/mutations/useForgotPassword'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/modules/auth/types/forgot-password.schema'

interface UseForgotPasswordFormResult {
  form: UseFormReturn<ForgotPasswordFormData>
  onSubmit: (data: ForgotPasswordFormData) => Promise<void>
}

export function useForgotPasswordForm(): UseForgotPasswordFormResult {
  const { mutateAsync: forgotPassword } = useForgotPassword()

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onTouched',
    defaultValues: { email: '' },
  })

  async function onSubmit(data: ForgotPasswordFormData): Promise<void> {
    await forgotPassword({ email: data.email })
  }

  return { form, onSubmit }
}
