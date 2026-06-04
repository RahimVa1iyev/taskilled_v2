import { useMemo } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useOnboardingFinish } from './useOnboardingFinish'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { authApi } from '@/modules/auth/api/auth.api'

import { useUserRole } from '@/modules/auth/store/auth.selectors'
import { userSkillsApi } from '@/features/onboarding/api/onboarding.api'
import { useCountries, useCities, useInterests, useSkills } from '@/shared/hooks/lookup'
import { useOnboardingStore } from '@/features/onboarding/store/onboarding.store'
import { INTERN_PROGRESS, INTERN_TOTAL_STEPS } from '../constants/useInternOnboarding.constants'
import type { InternStep, UseInternOnboardingResult, InternFormValues } from '../types/useInternOnboarding.types'
import { internStep1Schema } from '../schemas/onboarding.schemas'
import { toast } from '@/shared/lib/toast'

export function useInternOnboarding(): UseInternOnboardingResult {

  const role = useUserRole()
  const step = useOnboardingStore((s) => s.intern.step)
  const setInternStep = useOnboardingStore((s) => s.setInternStep)
  const resetIntern = useOnboardingStore((s) => s.resetIntern)
  const savedStep1 = useOnboardingStore((s) => s.intern.savedStep1)
  const saveInternStep1 = useOnboardingStore((s) => s.saveInternStep1)

  const form = useForm<InternFormValues>({
    resolver: zodResolver(internStep1Schema),
    mode: 'onTouched',
    defaultValues: {
      cityId: savedStep1?.cityId ?? undefined,
      interestIds: savedStep1?.interestIds ?? [],
      skillIds: savedStep1?.skillIds ?? [],
      areasOfInterest: savedStep1?.areasOfInterest ?? '',
    },
  })

  const { data: countries } = useCountries()
  const azerbaijanId = useMemo(
    () =>
      countries?.find((c) => c.name === 'Azerbaijan' || c.name === 'Azərbaycan')?.id ?? null,
    [countries],
  )
  const { data: cities, isLoading: isCitiesLoading } = useCities(azerbaijanId)
  const { data: interests, isLoading: isInterestsLoading } = useInterests()
  const { data: skills, isLoading: isSkillsLoading } = useSkills()

  const { mutateAsync: updateMe, isPending: isUpdating } = useMutation({
    mutationFn: authApi.updateMe,
  })
  const { mutateAsync: setUserSkills, isPending: isSkillsUpdating } = useMutation({
    mutationFn: (skillIds: number[]) =>
      userSkillsApi.setUserSkills(skillIds.map((id) => ({ skillId: id, level: 'Beginner' }))),
  })

  const progressWidth = INTERN_PROGRESS[step]
  const isPending = isUpdating || isSkillsUpdating

  function back(): void {
    if (step > 1) setInternStep((step - 1) as InternStep)
  }
  
  function next(): void {
    if (step === 1) {
      form.trigger(['cityId', 'interestIds']).then((valid) => {
        if (valid) {
          saveInternStep1(form.getValues())
          setInternStep(2)
        }
      })
      return
    }
    if (step === 2) {
      void submitAll()
    }
  }

  function skip(): void {
    form.setValue('skillIds', [])
    form.setValue('areasOfInterest', '')
    void submitAll()
  }

  async function submitAll(): Promise<void> {
    const values = form.getValues()
    const { cityId, interestIds, skillIds, areasOfInterest } = values
    const countryId = azerbaijanId
    
    if (cityId === null || countryId === null) {
      toast.error('City and country are required')
      return
    }
    try {
      await updateMe({
        cityId,
        countryId,
        interests: interestIds.map((interestId) => ({ interestId })),
        areasOfInterest: areasOfInterest.trim() || null,
      })
      if (skillIds.length > 0) await setUserSkills(skillIds)
      resetIntern()
      setInternStep(3)
    } catch {
      toast.apiError('Xəta baş verdi')
    }
  }

  const finish = useOnboardingFinish(resetIntern)

  return {
    step,
    progressWidth,
    totalSteps: INTERN_TOTAL_STEPS,
    role,
    isPending,
    back,
    cities: cities ?? [],
    isCitiesLoading,
    interests: interests ?? [],
    isInterestsLoading,
    skills: skills ?? [],
    isSkillsLoading,
    next,
    finish,
    skip,
    form,
  }
}
