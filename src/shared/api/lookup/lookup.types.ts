export interface CountryResponse {
  id: number
  name: string
}

export interface CityResponse {
  id: number
  name: string
  countryId: number
}

export interface InterestResponse {
  id: number
  nameAz: string
  nameEn: string
  nameRu: string
  nameTr: string
}

export interface SkillResponse {
  id: number
  name: string
}

export interface LanguageResponse {
  id: number
  name: string
}

export type SkillLevel =
  | 'Beginner'
  | 'Elementary'
  | 'Intermediate'
  | 'Advanced'
  | 'Expert'

export type LanguageLevel =
  | 'Beginner'
  | 'Elementary'
  | 'Intermediate'
  | 'Upper Intermediate'
  | 'Advanced'
  | 'Proficient'
  | 'Native'
