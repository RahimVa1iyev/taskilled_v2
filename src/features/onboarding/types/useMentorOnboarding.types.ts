import type {
  MentorSavedStep1,
  MentorSavedStep2,
  MentorSavedStep3,
} from '../store/onboarding.store.types'
import type { UseFormReturn } from 'react-hook-form'
import type { SkillResponse } from '@/shared/api/lookup'

export type MentorStep = 1 | 2 | 3 | 4

export type MentorStep1Values = MentorSavedStep1
export type MentorStep2Values = MentorSavedStep2
export type MentorStep3Values = MentorSavedStep3

export interface UseMentorOnboardingResult {
  step: MentorStep
  progressWidth: string
  totalSteps: number
  isPending: boolean
  finish: () => void
  back: () => void
  skills: SkillResponse[]
  isSkillsLoading: boolean
  next: () => Promise<void>
  step1Form: UseFormReturn<MentorStep1Values>
  step2Form: UseFormReturn<MentorStep2Values>
  step3Form: UseFormReturn<MentorStep3Values>
}
