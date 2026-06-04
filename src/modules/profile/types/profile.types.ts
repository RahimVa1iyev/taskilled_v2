// ─── Skill ──────────────────────────────────────────────────────────────────

export type SkillLevelEnum =
  | 'Beginner'
  | 'Elementary'
  | 'Intermediate'
  | 'Advanced'
  | 'Expert'

export interface UserSkillResponse {
  id: number
  name: string | null
  nameEn: string | null
  nameAz: string | null
  nameRu: string | null
  nameTr: string | null
  level: SkillLevelEnum | null
}

export interface UserSkillRequest {
  skillId: number
  level?: SkillLevelEnum | null
}

// ─── Language ───────────────────────────────────────────────────────────────

export interface UserLanguageResponse {
  id: number
  language: string
  languageLevel: string | null
  level: string | null
}

export interface UserLanguageRequest {
  language: string
  level: string
}

export interface BulkAddLanguagesRequest {
  languages: UserLanguageRequest[]
}

// ─── Experience ─────────────────────────────────────────────────────────────

export interface ExperienceResponse {
  id: number
  company: string
  position: string
  startDate: string
  start_date: string
  endDate: string | null
  end_date: string | null
  description: string | null
}

export interface ExperienceRequest {
  company: string
  position: string
  startDate: string
  endDate?: string | null
  description?: string | null
}

// ─── Education ──────────────────────────────────────────────────────────────

export interface EducationResponse {
  id: number
  schoolName: string
  school_name: string
  degree: string | null
  fieldOfStudy: string | null
  field_of_study: string | null
  startDate: string | null
  start_date: string | null
  endDate: string | null
  end_date: string | null
}

export interface EducationRequest {
  schoolName: string
  degree?: string | null
  fieldOfStudy?: string | null
  startDate?: string | null
  endDate?: string | null
}

// ─── Links ──────────────────────────────────────────────────────────────────

export interface LinkResponse {
  id: number
  url: string
  linkType: string | null
}

export interface LinkCreateRequest {
  url: string
  linkType?: string | null
}

// ─── Profile Update ─────────────────────────────────────────────────────────

export interface ProfileUpdateRequest {
  firstName?: string | null
  lastName?: string | null
  bio?: string | null
  birthDate?: string | null
  gender?: 'Male' | 'Female' | null
  cityId?: number | null
  countryId?: number | null
  phoneNumber?: string | null
  cvUrl?: string | null
  imgUrl?: string | null
  webSite?: string | null
  interests?: { interestId: number }[] | null
  areasOfInterest?: string | null
}
