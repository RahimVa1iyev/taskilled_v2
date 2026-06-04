import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { authApi } from '@/modules/auth/api/auth.api'
import { authKeys } from '@/modules/auth/api/auth.keys'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { redirectByRequiredFields } from '@/modules/auth/utils/onboarding-redirect'
import { onboardingKeys } from '@/features/onboarding/api/onboarding.keys'
import { rolesApi } from '@/features/onboarding/api/onboarding.api'
import { toast } from '@/shared/lib/toast'

const ROLE_DISPLAY_ORDER = ['intern', 'mentor', 'partner'] as const

import type { RoleId } from '@/modules/auth/types/auth.types'

interface DisplayRole {
  id: number
  name: RoleId
  displayName: string
}

interface UseRoleSelectionResult {
  roles: DisplayRole[]
  isLoadingRoles: boolean
  hasRoleLoadError: boolean
  selected: RoleId | ''
  select: (id: RoleId) => void
  continueNext: () => Promise<void>
  isPending: boolean
}

export function useRoleSelection(): UseRoleSelectionResult {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selected, setSelected] = useState<RoleId | ''>('')

  const { data: apiRoles, isLoading: isLoadingRoles } = useQuery({
    queryKey: onboardingKeys.roles(),
    queryFn: rolesApi.getRoles,
    staleTime: 10 * 60 * 1000,
  })

  const roles: DisplayRole[] = apiRoles
    ? ROLE_DISPLAY_ORDER.reduce<DisplayRole[]>((acc, roleName) => {
        const apiRole = apiRoles.find((r) => r.name === roleName)
        if (apiRole) {
          acc.push({
            id: apiRole.id,
            name: roleName,
            displayName: roleName.charAt(0).toUpperCase() + roleName.slice(1),
          })
        }
        return acc
      }, [])
    : []

  const hasRoleLoadError = !isLoadingRoles && roles.length === 0

  const { mutateAsync: updateMe, isPending } = useMutation({
    mutationFn: (roleId: number) => authApi.updateMe({ roleId }),
  })

  async function continueNext(): Promise<void> {
    if (!selected) return

    const roleObj = roles.find((r) => r.name === selected)
    if (!roleObj) return

    try {
      await updateMe(roleObj.id)
      const updated = await queryClient.fetchQuery({
        queryKey: authKeys.me(),
        queryFn: authApi.me,
      })
      useAuthStore.getState().setUser(updated)
      redirectByRequiredFields(updated.requiredFields ?? [], navigate)
    } catch {
      toast.error('Xəta baş verdi, yenidən cəhd edin')
    }
  }

  return {
    roles,
    isLoadingRoles,
    hasRoleLoadError,
    selected,
    select: setSelected,
    continueNext,
    isPending,
  }
}

