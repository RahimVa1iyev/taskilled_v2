import { FormPasswordInput, PasswordStrength, PrimaryButton } from '@/shared/ui'
import { useResetPasswordForm } from '@/modules/auth/hooks/useResetPasswordForm'

export function ResetPasswordForm(): React.JSX.Element {
  const { form, onSubmit } = useResetPasswordForm()
  const loading = form.formState.isSubmitting
  const password = form.watch('password') ?? ''

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FormPasswordInput
        control={form.control}
        name="password"
        label="New password"
        placeholder="At least 8 characters"
        autoComplete="new-password"
        required
        className="mb-6"
      />
      <PasswordStrength password={password} />
      <FormPasswordInput
        control={form.control}
        name="confirmPassword"
        label="Confirm password"
        placeholder="Repeat password"
        autoComplete="new-password"
        required
        className="mb-4"
      />

      <div className="mt-6">
        <PrimaryButton type="submit" loading={loading}>
          Update password
        </PrimaryButton>
      </div>
    </form>
  )
}
