import { Link } from 'react-router-dom'

import { AuthLayout } from '@/modules/auth/components/AuthLayout'
import { RegisterForm } from '@/modules/auth/components/forms/RegisterForm'
import { ROUTES } from '@/shared/constants/routes'

export function RegisterPage(): React.JSX.Element {
  return (
    <AuthLayout>
      <h1 className="text-[16px] font-bold text-foreground">Create your account</h1>
      <p className="mb-5 mt-1 text-[11px] text-muted-foreground">
        Start your internship journey today
      </p>

      <RegisterForm />

      <p className="mt-5 text-center text-[11px] text-muted-foreground">
        Already have an account?{' '}
        <Link to={ROUTES.AUTH.LOGIN} className="font-semibold text-auth-warn-link">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}

