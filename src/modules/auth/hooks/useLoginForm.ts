import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type UseFormReturn } from 'react-hook-form'

import { useLogin } from '@/modules/auth/api/mutations/useLogin'
import { loginSchema, type LoginFormData } from '@/modules/auth/types/auth.schema'
import { toast } from '@/shared/lib/toast'

interface UseLoginFormResult {
  form: UseFormReturn<LoginFormData>
  onGoogle: () => void
  onSubmit: (data: LoginFormData) => Promise<void>
}

export function useLoginForm(): UseLoginFormResult {
  const { mutateAsync: login } = useLogin()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(data: LoginFormData): Promise<void> {
    await login(data)
  }

  function onGoogle(): void {
    // TODO: Google OAuth — /api/v1/auth/google endpoint inteqrasiyası gözləyir
    toast.info('Google ilə giriş tezliklə aktiv olacaq')
  }

  return { form, onGoogle, onSubmit }
}

