import { useOnboardingStore } from '../onboarding.store'

describe('onboardingStore', () => {
  beforeEach(() => {
    useOnboardingStore.getState().resetIntern()
    useOnboardingStore.getState().resetMentor()
    useOnboardingStore.getState().resetPartner()
  })

  describe('intern', () => {
    it('initial step is 1', () => {
      expect(useOnboardingStore.getState().intern.step).toBe(1)
    })

    it('setInternStep changes step', () => {
      useOnboardingStore.getState().setInternStep(2)
      expect(useOnboardingStore.getState().intern.step).toBe(2)
    })

    it('saveInternStep1 saves data', () => {
      useOnboardingStore.getState().saveInternStep1({
        cityId: 5,
        interestIds: [1, 2],
        skillIds: [3],
        areasOfInterest: 'Frontend'
      })
      expect(useOnboardingStore.getState().intern.savedStep1?.cityId).toBe(5)
    })

    it('resetIntern goes back to initial state', () => {
      useOnboardingStore.getState().setInternStep(3)
      useOnboardingStore.getState().saveInternStep1({
        cityId: 5,
        interestIds: [1, 2],
        skillIds: [3],
        areasOfInterest: 'Frontend'
      })
      useOnboardingStore.getState().resetIntern()
      expect(useOnboardingStore.getState().intern.step).toBe(1)
      expect(useOnboardingStore.getState().intern.savedStep1).toBe(null)
    })
  })

  describe('mentor', () => {
    it('initial completed flags are all false', () => {
      expect(useOnboardingStore.getState().mentor.completed.profile).toBe(false)
      expect(useOnboardingStore.getState().mentor.completed.skills).toBe(false)
      expect(useOnboardingStore.getState().mentor.completed.link).toBe(false)
      expect(useOnboardingStore.getState().mentor.completed.cv).toBe(false)
    })

    it('saveMentorCompleted updates single flag', () => {
      useOnboardingStore.getState().saveMentorCompleted('profile', true)
      expect(useOnboardingStore.getState().mentor.completed.profile).toBe(true)
      expect(useOnboardingStore.getState().mentor.completed.skills).toBe(false)
    })

    it('resetMentor clears completed flags', () => {
      useOnboardingStore.getState().saveMentorCompleted('profile', true)
      useOnboardingStore.getState().saveMentorCompleted('cv', true)
      useOnboardingStore.getState().resetMentor()
      expect(useOnboardingStore.getState().mentor.completed.profile).toBe(false)
      expect(useOnboardingStore.getState().mentor.completed.cv).toBe(false)
    })
  })

  describe('partner', () => {
    it('resetPartnerToStep sets step but clears data', () => {
      useOnboardingStore.getState().savePartnerStep1({
        name: 'Company',
        taxId: '1234567890',
        contactEmail: 'hr@company.com',
        contactPhone: '+994501234567',
        countryId: 1,
        cityId: 1,
        industry: 'Technology'
      } as any)
      useOnboardingStore.getState().resetPartnerToStep(3)
      expect(useOnboardingStore.getState().partner.step).toBe(3)
      expect(useOnboardingStore.getState().partner.savedStep1).toBe(null)
    })
  })
})
