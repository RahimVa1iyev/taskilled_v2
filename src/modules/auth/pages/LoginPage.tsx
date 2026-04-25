import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

import { AuthLayout } from '@/modules/auth/components/AuthLayout'
import { BackButton } from '@/modules/auth/components/BackButton'
import { loginSchema, type LoginFormData } from '@/modules/auth/types/auth.schema'
import { ROUTES } from '@/shared/constants/routes'
import { toast } from '@/shared/lib/toast'
import { Divider, FormInput, FormPasswordInput, GoogleButton, PrimaryButton } from '@/shared/ui'
import { useAuthStore } from '@/modules/auth/store/auth.store'

export function LoginPage(): React.JSX.Element {
  const navigate = useNavigate()
  const setAccessToken = useAuthStore((s) => s.setAccessToken)
  const [googleLoading, setGoogleLoading] = useState(false)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const loading = form.formState.isSubmitting

  async function onSubmit(data: LoginFormData): Promise<void> {
    await new Promise((r) => setTimeout(r, 400))
    setAccessToken(`mock-token:${data.email}`)
    toast.success('Uğurla daxil oldunuz')
    navigate(ROUTES.HOME, { replace: true })
  }

  function handleGoogle(): void {
    setGoogleLoading(true)
    setTimeout(() => {
      setGoogleLoading(false)
      navigate(ROUTES.AUTH.ROLE)
    }, 900)
  }

  return (
    <AuthLayout>
      <BackButton />
      <h1 className="text-[16px] font-bold text-auth-ink">Welcome back</h1>
      <p className="mb-5 mt-1 text-[11px] text-auth-text">
        Sign in to continue your journey
      </p>

      <GoogleButton onClick={handleGoogle} loading={googleLoading} />
      <Divider />

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FormInput
          control={form.control}
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <FormPasswordInput
          control={form.control}
          name="password"
          label="Password"
          placeholder="Your password"
          autoComplete="current-password"
          required
        />

        <div className="-mt-2 mb-2 text-right">
          <Link to={ROUTES.AUTH.FORGOT_PASSWORD} className="text-[11px] font-semibold text-auth-warn-link">
            Forgot password?
          </Link>
        </div>

        <PrimaryButton type="submit" loading={loading}>
          Sign in
        </PrimaryButton>
      </form>

      <p className="mt-5 text-center text-[11px] text-auth-text">
        New to Taskilled?{' '}
        <Link to={ROUTES.AUTH.REGISTER} className="font-semibold text-auth-warn-link">
          Create account
        </Link>
      </p>
    </AuthLayout>
  )
}
