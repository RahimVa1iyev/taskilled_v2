import { AuthLayout } from '@/modules/auth/components/AuthLayout'
import { BackButton } from '@/modules/auth/components/BackButton'
import { ResetPasswordForm } from '@/modules/auth/components/forms/ResetPasswordForm'

export function ResetPasswordPage(): React.JSX.Element {
  return (
    <AuthLayout>
      <BackButton />
      <h1 className="text-[16px] font-bold text-foreground">Create new password</h1>
      <p className="mb-5 mt-1 text-[11px] text-muted-foreground">
        Create a new password for your account
      </p>

      <ResetPasswordForm />
    </AuthLayout>
  )
}

