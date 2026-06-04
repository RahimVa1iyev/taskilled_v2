import type { InternSavedStep1 } from '../store/onboarding.store.types'
import type { UseFormReturn } from 'react-hook-form'
import type { CityResponse, InterestResponse, SkillResponse } from '@/shared/api/lookup'

export type InternStep = 1 | 2 | 3

export type InternFormValues = InternSavedStep1

export interface UseInternOnboardingResult {
  step: InternStep
  progressWidth: string
  totalSteps: number
  role: string | null
  isPending: boolean
  back: () => void
  cities: CityResponse[]
  isCitiesLoading: boolean
  interests: InterestResponse[]
  isInterestsLoading: boolean
  skills: SkillResponse[]
  isSkillsLoading: boolean
  next: () => void
  finish: () => void
  skip: () => void
  form: UseFormReturn<InternFormValues>
}
