import { CheckCircle } from 'lucide-react'

import { FormPasswordInput, PasswordStrength, PrimaryButton } from '@/shared/ui'
import { useResetPasswordForm } from '@/modules/auth/hooks/useResetPasswordForm'

export function ResetPasswordForm(): React.JSX.Element {
  const { form, isDone, onSubmit } = useResetPasswordForm()
  const loading = form.formState.isSubmitting
  const password = form.watch('password') ?? ''

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FormPasswordInput
          control={form.control}
          name="password"
          label="New password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          required
        />
        <PasswordStrength password={password} />
        <FormPasswordInput
          control={form.control}
          name="confirmPassword"
          label="Confirm password"
          placeholder="Repeat password"
          autoComplete="new-password"
          required
        />

        <div className="mt-6">
          <PrimaryButton type="submit" loading={loading}>
            Update password
          </PrimaryButton>
        </div>
      </form>

      {isDone ? (
        <div className="mt-3 flex animate-fade-in items-center gap-3 rounded-2xl border border-auth-accent/40 bg-white px-4 py-3">
          <CheckCircle className="h-4 w-4 text-auth-accent" />
          <span className="text-[12px] font-semibold text-auth-ink">
            Password updated!
          </span>
        </div>
      ) : null}
    </>
  )
}

