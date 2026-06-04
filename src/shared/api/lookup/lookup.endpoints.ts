import { SERVICES } from '@/shared/constants/services'

export const LOOKUP_ENDPOINTS = {
  countries: `${SERVICES.userManagement}/country/`,
  cities: (countryId: number) => `${SERVICES.userManagement}/country/${countryId}/cities`,
  interests: `${SERVICES.userManagement}/interests`,
  skills: `${SERVICES.userManagement}/skill`,
  skillLevels: `${SERVICES.userManagement}/skill/levels`,
  languages: `${SERVICES.userManagement}/language/`,
  languageLevels: `${SERVICES.userManagement}/language/levels`,
} as const
