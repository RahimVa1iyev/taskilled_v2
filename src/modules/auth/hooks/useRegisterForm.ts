import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useRegister } from '@/modules/auth/api/mutations/useRegister'
import { registerSchema, type RegisterFormData } from '@/modules/auth/types/register.schema'
import { ROUTES } from '@/shared/constants/routes'
import { toast } from '@/shared/lib/toast'

interface UseRegisterFormResult {
  form: UseFormReturn<RegisterFormData>
  password: string
  onGoogle: () => void
  onSubmit: (data: RegisterFormData) => Promise<void>
}

export function useRegisterForm(): UseRegisterFormResult {
  const navigate = useNavigate()
  const { mutateAsync: register } = useRegister()

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  })

  const password = form.watch('password') ?? ''

  async function onSubmit(data: RegisterFormData): Promise<void> {
    try {
      const response = await register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      })
      navigate(ROUTES.AUTH.VERIFY, { state: { flow: 'register', email: response.email } })
    } catch {
      // global interceptor handles error toast
    }
  }

  function onGoogle(): void {
    // TODO: Google OAuth — /api/v1/auth/google endpoint inteqrasiyası gözləyir
    toast.info('Google ilə giriş tezliklə aktiv olacaq')
  }

  return { form, password, onGoogle, onSubmit }
}
