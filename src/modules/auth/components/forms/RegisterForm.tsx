import { Divider, FormCheckbox, FormInput, FormPasswordInput, GoogleButton, PasswordStrength, PrimaryButton } from '@/shared/ui'
import { useRegisterForm } from '@/modules/auth/hooks/useRegisterForm'

export function RegisterForm(): React.JSX.Element {
  const { form, password, isGoogleLoading, onGoogle, onSubmit } = useRegisterForm()
  const loading = form.formState.isSubmitting

  return (
    <>
      <GoogleButton onClick={onGoogle} loading={isGoogleLoading} />
      <Divider />

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FormInput
          control={form.control}
          name="name"
          label="Name"
          placeholder="Jane"
          autoComplete="given-name"
          required
        />
        <FormInput
          control={form.control}
          name="surname"
          label="Surname"
          placeholder="Doe"
          autoComplete="family-name"
          required
        />
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
          placeholder="At least 8 characters"
          autoComplete="new-password"
          required
        />
        <PasswordStrength password={password} />

        <FormCheckbox
          control={form.control}
          name="agree"
          label="I agree to Terms of Service and Privacy Policy"
        />

        <div className="mt-3">
          <PrimaryButton type="submit" loading={loading}>
            Create account
          </PrimaryButton>
        </div>
      </form>
    </>
  )
}

