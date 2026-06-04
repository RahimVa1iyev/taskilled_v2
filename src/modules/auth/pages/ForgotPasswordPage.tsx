import { KeyRound } from 'lucide-react'
import { Link } from 'react-router-dom'

import { AuthLayout } from '@/modules/auth/components/AuthLayout'
import { ForgotPasswordForm } from '@/modules/auth/components/forms/ForgotPasswordForm'
import { ROUTES } from '@/shared/constants/routes'

export function ForgotPasswordPage(): React.JSX.Element {
  return (
    <AuthLayout>

      <div className="mb-4 flex h-[48px] w-[48px] items-center justify-center rounded-[14px] border border-border bg-card">
        <KeyRound className="h-5 w-5 text-primary" />
      </div>
      <h1 className="text-[16px] font-bold text-foreground">Reset your password</h1>
      <p className="mb-5 mt-1 text-[11px] text-muted-foreground">
        Enter your email and we'll send you a reset code
      </p>

      <ForgotPasswordForm />
      <Link to={ROUTES.AUTH.LOGIN} className="mt-3 block text-[11px] font-semibold text-auth-warn-link">
        ← Back to sign in
      </Link>
    </AuthLayout>
  )
}

