import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { ROUTES } from '@/shared/constants/routes'
import { useIsAuthenticated } from '@/modules/auth'

export function AuthGuard(): React.JSX.Element {
  const isAuthenticated = useIsAuthenticated()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace state={{ from: location }} />
  }

  return <Outlet />
}

