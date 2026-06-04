import { api } from '@/shared/lib/axios'
import { LOOKUP_ENDPOINTS } from './lookup.endpoints'
import type {
  CountryResponse,
  CityResponse,
  InterestResponse,
  SkillResponse,
  LanguageResponse,
} from './lookup.types'

export const lookupApi = {
  getCountries: (): Promise<CountryResponse[]> =>
    api.get(LOOKUP_ENDPOINTS.countries).then((r) => r.data),

  getCities: (countryId: number): Promise<CityResponse[]> =>
    api.get(LOOKUP_ENDPOINTS.cities(countryId)).then((r) => r.data),

  getInterests: (): Promise<InterestResponse[]> =>
    api.get(LOOKUP_ENDPOINTS.interests).then((r) => r.data),

  getSkills: (): Promise<SkillResponse[]> =>
    api.get(LOOKUP_ENDPOINTS.skills).then((r) => r.data),

  getSkillLevels: (): Promise<string[]> =>
    api.get(LOOKUP_ENDPOINTS.skillLevels).then((r) => r.data),

  getLanguages: async (): Promise<LanguageResponse[]> => {
    const response = await api.get(LOOKUP_ENDPOINTS.languages)
    const data = response.data as unknown

    if (Array.isArray(data) && typeof data[0] === 'string') {
      return (data as string[]).map((name, index) => ({
        id: index,
        name,
      }))
    }

    return (data as LanguageResponse[]) ?? []
  },

  getLanguageLevels: (): Promise<string[]> =>
    api.get(LOOKUP_ENDPOINTS.languageLevels).then((r) => r.data),
}
