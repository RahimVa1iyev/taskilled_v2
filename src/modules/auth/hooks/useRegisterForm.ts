import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/shared/constants/routes'
import { registerSchema, type RegisterFormData } from '@/modules/auth/types/register.schema'

interface UseRegisterFormResult {
  form: UseFormReturn<RegisterFormData>
  password: string
  isGoogleLoading: boolean
  onGoogle: () => void
  onSubmit: (data: RegisterFormData) => Promise<void>
}

export function useRegisterForm(): UseRegisterFormResult {
  const navigate = useNavigate()
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      surname: '',
      email: '',
      password: '',
      agree: false,
    },
  })

  const password = form.watch('password') ?? ''

  async function onSubmit(_: RegisterFormData): Promise<void> {
    await new Promise((r) => setTimeout(r, 600))
    navigate(ROUTES.AUTH.VERIFY, { state: { reason: 'emailVerify' } })
  }

  function onGoogle(): void {
    setIsGoogleLoading(true)
    setTimeout(() => {
      setIsGoogleLoading(false)
      navigate(ROUTES.AUTH.ROLE)
    }, 900)
  }

  return { form, password, isGoogleLoading, onGoogle, onSubmit }
}

