import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { authKeys } from '@/modules/auth/api/auth.keys'
import { ROUTES } from '@/shared/constants/routes'

export function useOnboardingFinish(resetFn: () => void): () => void {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return function finish(): void {
    resetFn()
    void queryClient.invalidateQueries({ queryKey: authKeys.me() })
    navigate(ROUTES.APP.DASHBOARD, { replace: true })
  }
}
