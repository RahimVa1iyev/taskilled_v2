import { SERVICES } from '@/shared/constants/services'

const BASE = SERVICES.userManagement

export const ONBOARDING_ENDPOINTS = {
  roles: `${BASE}/role`,
  userSkills: `${BASE}/skill/user-skills`,
  company: `${BASE}/company/`,
} as const
