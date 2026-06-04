import { Navigate, Outlet } from 'react-router-dom'

import { useIsAuthenticated, useIsInitialized } from '@/modules/auth'
import { ROUTES } from '@/shared/constants/routes'
import { Spinner } from '@/shared/ui/custom/Spinner'

export function GuestGuard(): React.JSX.Element {
  const isInitialized = useIsInitialized()
  const isAuthenticated = useIsAuthenticated()

  if (!isInitialized) return <Spinner />

  if (isAuthenticated) return <Navigate to={ROUTES.APP.DASHBOARD} replace />

  return <Outlet />
}

