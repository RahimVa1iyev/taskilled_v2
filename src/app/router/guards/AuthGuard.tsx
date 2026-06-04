import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { Spinner } from '@/shared/ui/custom/Spinner'
import { ROUTES } from '@/shared/constants/routes'
import { useIsAuthenticated, useIsInitialized, useUser } from '@/modules/auth'
import { useMe } from '@/modules/auth/api/queries/useMe'

// App routes where users can access even with incomplete onboarding
// (so they can complete their profile from within the app)
const APP_ROUTES = [ROUTES.APP.DASHBOARD, ROUTES.APP.PROFILE]

export function AuthGuard(): React.JSX.Element {
  const isInitialized = useIsInitialized()
  const isAuthenticated = useIsAuthenticated()
  const user = useUser()
  const location = useLocation()
  const { isLoading } = useMe()

  if (!isInitialized || isLoading) {
    return <Spinner />
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace state={{ from: location }} />
  }

  if (!user) {
    return <Spinner />
  }

  // Allow app routes even when onboarding is incomplete — user can complete profile
  const isAppRoute = APP_ROUTES.some((r) => location.pathname.startsWith(r))
  if (!isAppRoute && (user.requiredFields ?? []).length > 0) {
    return <Navigate to={ROUTES.AUTH.ROLE} replace />
  }

  return <Outlet />
}
