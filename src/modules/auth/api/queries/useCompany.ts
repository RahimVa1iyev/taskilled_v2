import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import { companyApi } from '@/modules/auth/api/company.api'
import { companyKeys } from '@/modules/auth/api/company.keys'
import { useCompanyStore } from '@/modules/auth/store/company.store'
import { useUserRole, useIsAuthenticated } from '@/modules/auth/store/auth.selectors'

export function useCompany() {
  const isAuthenticated = useIsAuthenticated()
  const role = useUserRole()
  const setCompany = useCompanyStore((s) => s.setCompany)

  const query = useQuery({
    queryKey: companyKeys.me(),
    queryFn: companyApi.getMyCompany,
    enabled: isAuthenticated && role === 'partner',
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    if (query.data) {
      setCompany(query.data)
    }
  }, [query.data, setCompany])

  return query
}
