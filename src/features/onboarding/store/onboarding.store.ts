import { create } from 'zustand'
import type { MentorStep } from '../types/useMentorOnboarding.types'
import type { InternStep } from '../types/useInternOnboarding.types'
import type { PartnerStep } from '../types/usePartnerOnboarding.types'
import { persist, createJSONStorage } from 'zustand/middleware'

import {
  type InternSlice,
  type MentorSlice,
  type PartnerSlice,
  initialInternSlice,
  initialMentorSlice,
  initialPartnerSlice,
  type InternSavedStep1,
  type MentorSavedStep1,
  type MentorSavedStep2,
  type MentorSavedStep3,
  type PartnerSavedStep1,
} from '@/features/onboarding/store/onboarding.store.types'

interface OnboardingStore {
  intern: InternSlice
  mentor: MentorSlice
  partner: PartnerSlice

  setInternStep: (step: InternStep) => void
  setMentorStep: (step: MentorStep) => void
  setPartnerStep: (step: PartnerStep) => void
  resetIntern: () => void
  resetMentor: () => void
  resetPartner: () => void
  resetPartnerToStep: (step: PartnerStep) => void
  saveInternStep1: (data: InternSavedStep1) => void
  saveMentorStep1: (data: MentorSavedStep1) => void
  saveMentorStep2: (data: MentorSavedStep2) => void
  saveMentorStep3: (data: MentorSavedStep3) => void
  savePartnerStep1: (data: PartnerSavedStep1) => void
  saveMentorCompleted: (key: 'profile' | 'skills' | 'link' | 'cv', value: boolean) => void
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      intern: initialInternSlice(),
      mentor: initialMentorSlice(),
      partner: initialPartnerSlice(),

      setInternStep: (step) => set((s) => ({ intern: { ...s.intern, step } })),

      setMentorStep: (step) => set((s) => ({ mentor: { ...s.mentor, step } })),

      setPartnerStep: (step) => set((s) => ({ partner: { ...s.partner, step } })),

      resetIntern: () => set({ intern: initialInternSlice() }),

      resetMentor: () => set({ mentor: initialMentorSlice() }),

      resetPartner: () => set({ partner: initialPartnerSlice() }),

      resetPartnerToStep: (step: PartnerStep) =>
        set({ partner: { ...initialPartnerSlice(), step } }),

      saveInternStep1: (data) =>
        set((s) => ({ intern: { ...s.intern, savedStep1: data } })),
      saveMentorStep1: (data) =>
        set((s) => ({ mentor: { ...s.mentor, savedStep1: data } })),
      saveMentorStep2: (data) =>
        set((s) => ({ mentor: { ...s.mentor, savedStep2: data } })),
      saveMentorStep3: (data) =>
        set((s) => ({ mentor: { ...s.mentor, savedStep3: data } })),
      savePartnerStep1: (data) =>
        set((s) => ({ partner: { ...s.partner, savedStep1: data } })),
      saveMentorCompleted: (key, value) =>
        set((s) => ({ mentor: { ...s.mentor, completed: { ...s.mentor.completed, [key]: value } } })),
    }),
    {
      name: 'onboarding-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({
        intern: s.intern,
        mentor: s.mentor,
        partner: s.partner,
      }),
    }
  )
)

export type {
  InternSlice,
  MentorSlice,
  PartnerSlice,
} from './onboarding.store.types'

export function resetOnboardingStore(): void {
  useOnboardingStore.getState().resetIntern()
  useOnboardingStore.getState().resetMentor()
  useOnboardingStore.getState().resetPartner()
}
