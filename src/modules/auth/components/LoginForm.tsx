import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate, useLocation } from 'react-router-dom'

import { ROUTES } from '@/shared/constants/routes'
import { toast } from '@/shared/lib/toast'
import { Button, Input, Label } from '@/shared/ui'
import { loginSchema, type LoginFormData } from '@/modules/auth/types/auth.schema'
import { useAuthStore } from '@/modules/auth/store/auth.store'

interface LoginFormProps {
  className?: string
}

export function LoginForm({ className }: LoginFormProps): React.JSX.Element {
  const navigate = useNavigate()
  const location = useLocation()
  const setAccessToken = useAuthStore((s) => s.setAccessToken)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const isPending = form.formState.isSubmitting

  async function onSubmit(data: LoginFormData): Promise<void> {
    // Placeholder: API gələndə buranı mutation-a keçirəcəyik
    await new Promise((r) => setTimeout(r, 300))
    setAccessToken(`mock-token:${data.email}`)
    toast.success('Uğurla daxil oldunuz')

    const from = (location.state as { from?: Location })?.from
    navigate(from?.pathname ?? ROUTES.HOME, { replace: true })
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={className ?? 'space-y-4'}
    >
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" {...form.register('email')} />
        {form.formState.errors.email?.message ? (
          <p className="text-sm text-destructive" aria-live="polite">
            {form.formState.errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Şifrə</Label>
        <Input id="password" type="password" {...form.register('password')} />
        {form.formState.errors.password?.message ? (
          <p className="text-sm text-destructive" aria-live="polite">
            {form.formState.errors.password.message}
          </p>
        ) : null}
      </div>

      <Button type="submit" disabled={isPending} aria-busy={isPending} className="w-full">
        {isPending ? 'Daxil olunur...' : 'Daxil ol'}
      </Button>
    </form>
  )
}

