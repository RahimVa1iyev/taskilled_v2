import { Navigate, Outlet } from 'react-router-dom'

import { useIsAuthenticated, useIsInitialized, useRequiredFields } from '@/modules/auth'
import { Spinner } from '@/shared/ui/custom/Spinner'
import { ROUTES } from '@/shared/constants/routes'

/**
 * Token var + onboarding bitməyib olan user üçün keçid guard-ı.
 *
 * - init gözlənilir
 * - Token yoxdursa → /auth/login
 * - requiredFields boşdursa (onboarding bitib) → /home
 * - requiredFields dolusa → keç (role/onboarding route-larına)
 */
export function OnboardingGuard(): React.JSX.Element {
  const isInitialized = useIsInitialized()
  const isAuthenticated = useIsAuthenticated()
  const requiredFields = useRequiredFields()

  if (!isInitialized) return <Spinner />

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />
  }

  if (requiredFields.length === 0) {
    return <Navigate to={ROUTES.APP.DASHBOARD} replace />
  }

  return <Outlet />
}
