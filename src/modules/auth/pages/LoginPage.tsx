import { AuthLayout } from '@/modules/auth/components/AuthLayout'
import { LoginForm } from '@/modules/auth/components/forms/LoginForm'
import { ROUTES } from '@/shared/constants/routes'
import { Link } from 'react-router-dom'

export function LoginPage(): React.JSX.Element {
  return (
    <AuthLayout>
      <h1 className="text-[16px] font-bold text-foreground">Welcome back</h1>
      <p className="mb-5 mt-1 text-[11px] text-muted-foreground">
        Sign in to continue your journey
      </p>

      <LoginForm />

      <p className="mt-5 text-center text-[11px] text-muted-foreground">
        New to Taskilled?{' '}
        <Link to={ROUTES.AUTH.REGISTER} className="font-semibold text-auth-warn-link">
          Create account
        </Link>
      </p>
    </AuthLayout>
  )
}
