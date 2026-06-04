import { z } from 'zod'
import type { MentorStep } from '../types/useMentorOnboarding.types'
import type { InternStep } from '../types/useInternOnboarding.types'
import type { PartnerStep } from '../types/usePartnerOnboarding.types'
import {
  internStep1Schema,
  mentorStep1Schema,
  mentorStep2Schema,
  mentorStep3Schema,
  partnerStep1Schema,
} from '../schemas/onboarding.schemas'

export type InternSavedStep1 = z.infer<typeof internStep1Schema>
export type MentorSavedStep1 = z.infer<typeof mentorStep1Schema>
export type MentorSavedStep2 = z.infer<typeof mentorStep2Schema>
export type MentorSavedStep3 = z.infer<typeof mentorStep3Schema>
export type PartnerSavedStep1 = z.infer<typeof partnerStep1Schema>

export interface InternSlice {
  step: InternStep
  savedStep1: InternSavedStep1 | null
}
export function initialInternSlice(): InternSlice {
  return { step: 1, savedStep1: null }
}

export interface MentorSlice {
  step: MentorStep
  savedStep1: MentorSavedStep1 | null
  savedStep2: MentorSavedStep2 | null
  savedStep3: MentorSavedStep3 | null
  completed: { profile: boolean; skills: boolean; link: boolean; cv: boolean }
}
export function initialMentorSlice(): MentorSlice {
  return { 
    step: 1, 
    savedStep1: null, 
    savedStep2: null, 
    savedStep3: null,
    completed: { profile: false, skills: false, link: false, cv: false }
  }
}

export interface PartnerSlice {
  step: PartnerStep
  savedStep1: PartnerSavedStep1 | null
}
export function initialPartnerSlice(): PartnerSlice {
  return { step: 1, savedStep1: null }
}
