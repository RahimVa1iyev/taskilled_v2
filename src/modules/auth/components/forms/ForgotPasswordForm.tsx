import { FormInput, PrimaryButton } from '@/shared/ui'
import { useForgotPasswordForm } from '@/modules/auth/hooks/useForgotPasswordForm'

export function ForgotPasswordForm(): React.JSX.Element {
  const { form, onSubmit } = useForgotPasswordForm()
  const loading = form.formState.isSubmitting

  return (
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
      <PrimaryButton type="submit" loading={loading}>
        Send reset code
      </PrimaryButton>
    </form>
  )
}

