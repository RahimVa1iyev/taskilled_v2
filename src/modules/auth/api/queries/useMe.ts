import { useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { authApi } from '@/modules/auth/api/auth.api'
import { authKeys } from '@/modules/auth/api/auth.keys'
import { clearAuth, setInitialized, useAuthStore } from '@/modules/auth/store/auth.store'
import { useAccessToken } from '@/modules/auth/store/auth.selectors'
import { ROUTES } from '@/shared/constants/routes'
import { redirectByRequiredFields } from '@/modules/auth/utils/onboarding-redirect'

export function useMe() {
  const accessToken = useAccessToken()
  const setUser = useAuthStore((s) => s.setUser)
  const navigate = useNavigate()
  const location = useLocation()

  const navigateRef = useRef(navigate)
  useEffect(() => { navigateRef.current = navigate })
  const pathnameRef = useRef(location.pathname)
  useEffect(() => { pathnameRef.current = location.pathname })

  const query = useQuery({
    queryKey: authKeys.me(),
    queryFn: authApi.me,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    if (!accessToken) setInitialized()
  }, [accessToken])

  useEffect(() => {
    if (!query.data) return
    setUser(query.data)
    setInitialized()

    const requiredFields = query.data.requiredFields ?? []
    const currentPath = pathnameRef.current
    if (requiredFields.length === 0) return
    if (currentPath === ROUTES.AUTH.ROLE && requiredFields.includes('role')) return
    if (currentPath === ROUTES.AUTH.ONBOARDING && !requiredFields.includes('role')) return
    redirectByRequiredFields(requiredFields, navigateRef.current)
  }, [query.data, setUser])

  useEffect(() => {
    if (!query.isError) return
    const status = (query.error as AxiosError)?.response?.status
    if (status === 401) {
      clearAuth()
      setInitialized()
    }
  }, [query.isError, query.error])

  return query
}