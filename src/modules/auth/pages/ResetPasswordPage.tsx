import { useLocation, Navigate } from 'react-router-dom'

import { AuthLayout } from '@/modules/auth/components/AuthLayout'
import { ResetPasswordForm } from '@/modules/auth/components/forms/ResetPasswordForm'
import { ROUTES } from '@/shared/constants/routes'

export function ResetPasswordPage(): React.JSX.Element {
  const location = useLocation()
  const token = (location.state as { token?: string } | null)?.token

  if (!token) {
    return <Navigate to={ROUTES.AUTH.FORGOT_PASSWORD} replace />
  }

  return (
    <AuthLayout hideBackLink>
      <h1 className="text-[16px] font-bold text-foreground">Create new password</h1>
      <p className="mb-5 mt-1 text-[11px] text-muted-foreground">
        Create a new password for your account
      </p>

      <ResetPasswordForm />
    </AuthLayout>
  )
}
