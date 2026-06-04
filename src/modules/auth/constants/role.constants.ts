import { Building2, GraduationCap, Users } from 'lucide-react'

import type { RoleId } from '@/modules/auth/types/auth.types'

export const ROLE_ICON: Record<RoleId, React.ElementType> = {
  intern: GraduationCap,
  mentor: Users,
  partner: Building2,
}

export const ROLE_DESC: Record<RoleId, string> = {
  intern: 'Join programs, complete tasks, earn certificates',
  mentor: 'Review tasks, give feedback, guide interns',
  partner: 'Create programs, hire interns, build talent',
}
