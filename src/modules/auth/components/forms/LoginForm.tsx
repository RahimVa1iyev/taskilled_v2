import { Link } from 'react-router-dom'

import { useLoginForm } from '@/modules/auth/hooks/useLoginForm'
import { ROUTES } from '@/shared/constants/routes'
import { Divider, FormInput, FormPasswordInput, GoogleButton, PrimaryButton } from '@/shared/ui'

interface LoginFormProps {
  className?: string
}

export function LoginForm({ className }: LoginFormProps): React.JSX.Element {
  const { form, onGoogle, onSubmit } = useLoginForm()
  const loading = form.formState.isSubmitting

  return (
    <div className={className}>
      <GoogleButton onClick={onGoogle} loading={false} />
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
          className="mb-4"
        />
        <FormPasswordInput
          control={form.control}
          name="password"
          label="Password"
          placeholder="Your password"
          autoComplete="current-password"
          required
          className="mb-4"
        />

        <div className="-mt-2 mb-2 text-right">
          <Link
            to={ROUTES.AUTH.FORGOT_PASSWORD}
            className="text-[11px] font-semibold text-auth-warn-link"
          >
            Forgot password?
          </Link>
        </div>

        <PrimaryButton type="submit" loading={loading}>
          Sign in
        </PrimaryButton>
      </form>
    </div>
  )
}

