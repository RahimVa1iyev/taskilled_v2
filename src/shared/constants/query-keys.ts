export const LOOKUP_QUERY_KEYS = {
  countries: ['countries'] as const,
  cities: (countryId: number) => ['cities', countryId] as const,
  interests: ['interests'] as const,
  skills: ['skills'] as const,
  languages: ['languages'] as const,
  languageLevels: ['language-levels'] as const,
  skillLevels: ['skill-levels'] as const,
} as const

export const AUTH_QUERY_KEYS = {
  me: ['me'] as const,
} as const

export const LINKS_QUERY_KEYS = {
  userLinks: ['user-links'] as const,
} as const

export const PROFILE_QUERY_KEYS = {
  education: ['education'] as const,
  experience: ['experience'] as const,
  userSkills: ['user-skills'] as const,
  userLanguages: ['user-languages'] as const,
  links: ['links'] as const,
  company: ['company'] as const,
} as const
