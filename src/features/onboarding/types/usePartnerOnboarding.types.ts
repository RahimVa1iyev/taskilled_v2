import type { PartnerSavedStep1 } from '../store/onboarding.store.types'
import type { UseFormReturn } from 'react-hook-form'
import type { CityResponse, CountryResponse } from '@/shared/api/lookup'

export type PartnerStep = 1 | 2 | 3

export type PartnerStep1Values = PartnerSavedStep1

export interface PartnerStep2Values {
  description?: string
  website?: string
  linkedinUrl?: string
  size?: string
}

export interface UsePartnerOnboardingResult {
  step: PartnerStep
  progressWidth: string
  totalSteps: number
  finish: () => void
  next: () => void
  back: () => void
  skip: () => void
  countries: CountryResponse[]
  isCountriesLoading: boolean
  cities: CityResponse[]
  isCitiesLoading: boolean

  isPending: boolean
  submit: () => Promise<void>
  form: UseFormReturn<PartnerStep1Values, any, any>
  step2Form: UseFormReturn<PartnerStep2Values, any, any>
}
