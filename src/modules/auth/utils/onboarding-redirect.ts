import type { NavigateFunction } from 'react-router-dom'

import { ROUTES } from '@/shared/constants/routes'

/**
 * auth/me-dən gələn requiredFields array-inə görə
 * user-i doğru səhifəyə yönləndirir.
 *
 * - ['role', ...]          → /auth/role
 * - ['city', 'interests']  → /auth/onboarding
 * - []                     → / (ana səhifə)
 */
export function redirectByRequiredFields(
  requiredFields: string[],
  navigate: NavigateFunction,
): void {
  if (requiredFields.length === 0) {
    navigate(ROUTES.APP.DASHBOARD, { replace: true })
    return
  }
  if (requiredFields.includes('role')) {
    navigate(ROUTES.AUTH.ROLE, { replace: true })
    return
  }
  navigate(ROUTES.AUTH.ONBOARDING, { replace: true })
}
