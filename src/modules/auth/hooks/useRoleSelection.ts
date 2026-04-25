import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/shared/constants/routes'

export type RoleId = 'intern' | 'mentor' | 'partner'

interface UseRoleSelectionResult {
  selected: RoleId | ''
  select: (id: RoleId) => void
  continueNext: () => void
}

export function useRoleSelection(): UseRoleSelectionResult {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<RoleId | ''>('')

  function select(id: RoleId): void {
    setSelected(id)
  }

  function continueNext(): void {
    if (!selected) return
    sessionStorage.setItem('role', selected)
    navigate(ROUTES.AUTH.ONBOARDING)
  }

  return { selected, select, continueNext }
}

