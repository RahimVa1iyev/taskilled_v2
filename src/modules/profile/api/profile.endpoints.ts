import { SERVICES } from '@/shared/constants/services'

const BASE = SERVICES.userManagement

export const PROFILE_ENDPOINTS = {
  me:               `${BASE}/auth/me`,
  skills:           `${BASE}/skill/user-skills`,
  deleteSkill:      (id: number) => `${BASE}/skill/user-skills/${id}`,
  languages:        `${BASE}/language/user-languages`,
  bulkLanguages:    `${BASE}/language/user-languages/bulk-add`,
  deleteLanguage:   (id: number) => `${BASE}/language/user-languages/${id}`,
  experiences:      `${BASE}/experience`,
  deleteExperience: (id: number) => `${BASE}/experience/${id}`,
  educations:       `${BASE}/education`,
  deleteEducation:  (id: number) => `${BASE}/education/${id}`,
  links:            `${BASE}/links`,
  deleteLink:       (id: number) => `${BASE}/links/${id}`,
} as const
