import type React from 'react'
import type { RoleId } from '@/modules/auth/types/auth.types'
import { InternOnboardingView } from '@/features/onboarding/components/InternOnboardingView'
import { MentorOnboardingView } from '@/features/onboarding/components/MentorOnboardingView'
import { PartnerOnboardingView } from '@/features/onboarding/components/PartnerOnboardingView'
import { useUserRole } from '@/modules/auth'
import { Spinner } from '@/shared/ui/custom/Spinner'

const ONBOARDING_VIEW: Partial<Record<RoleId, React.ComponentType>> = {
  mentor: MentorOnboardingView,
  partner: PartnerOnboardingView,
  intern: InternOnboardingView,
}

export function OnboardingPage(): React.JSX.Element {
  const role = useUserRole()
  if (!role) return <Spinner />

  const View = ONBOARDING_VIEW[role as RoleId] ?? InternOnboardingView
  return <View />
}
