import { api } from '@/shared/lib/axios'
import { ONBOARDING_ENDPOINTS } from '@/features/onboarding/constants/onboarding.endpoints'

// ---- ROLES ----

export interface RoleApiResponse {
  id: number
  name: string
  descriptionAz: string | null
  descriptionEn: string | null
}

export const rolesApi = {
  getRoles: (): Promise<RoleApiResponse[]> =>
    api.get(ONBOARDING_ENDPOINTS.roles).then((r) => r.data),
}

// ---- USER SKILLS (write) ----

export const userSkillsApi = {
  setUserSkills: (skills: { skillId: number; level: string }[]): Promise<unknown> =>
    api.post(ONBOARDING_ENDPOINTS.userSkills, skills).then((r) => r.data),
}
