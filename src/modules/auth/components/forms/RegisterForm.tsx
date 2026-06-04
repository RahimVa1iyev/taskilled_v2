import { Divider, FormInput, FormPasswordInput, GoogleButton, PasswordStrength, PrimaryButton } from '@/shared/ui'
import { useRegisterForm } from '@/modules/auth/hooks/useRegisterForm'

export function RegisterForm(): React.JSX.Element {
  const { form, password, onGoogle, onSubmit } = useRegisterForm()
  const loading = form.formState.isSubmitting

  return (
    <>
      <GoogleButton onClick={onGoogle} loading={false} />
      <Divider />

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FormInput
          control={form.control}
          name="firstName"
          label="Name"
          placeholder="Jane"
          autoComplete="given-name"
          required
          className="mb-4"
        />
        <FormInput
          control={form.control}
          name="lastName"
          label="Surname"
          placeholder="Doe"
          autoComplete="family-name"
          required
          className="mb-4"
        />
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
          placeholder="At least 8 characters"
          autoComplete="new-password"
          required
          className="mb-4"
        />
        <PasswordStrength password={password} />

        <div className="mt-3">
          <PrimaryButton type="submit" loading={loading}>
            Create account
          </PrimaryButton>
        </div>
      </form>
    </>
  )
}
