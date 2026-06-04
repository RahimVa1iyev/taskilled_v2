import { useMutation } from '@tanstack/react-query'
import { useOnboardingFinish } from './useOnboardingFinish'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { authApi } from '@/modules/auth/api/auth.api'

import { userSkillsApi } from '@/features/onboarding/api/onboarding.api'
import { useSkills } from '@/shared/hooks/lookup'
import { linksApi } from '@/shared/api/links'
import { MENTOR_TOTAL_STEPS } from '../constants/useMentorOnboarding.constants'
import type { MentorStep, UseMentorOnboardingResult, MentorStep1Values, MentorStep2Values, MentorStep3Values } from '../types/useMentorOnboarding.types'
import { mentorStep1Schema, mentorStep2Schema, mentorStep3Schema } from '../schemas/onboarding.schemas'
import { useOnboardingStore } from '@/features/onboarding/store/onboarding.store'
import { toast } from '@/shared/lib/toast'

export function useMentorOnboarding(): UseMentorOnboardingResult {

  const step = useOnboardingStore((s) => s.mentor.step)
  const setMentorStep = useOnboardingStore((s) => s.setMentorStep)
  const resetMentor = useOnboardingStore((s) => s.resetMentor)
  const savedStep1 = useOnboardingStore((s) => s.mentor.savedStep1)
  const savedStep2 = useOnboardingStore((s) => s.mentor.savedStep2)
  const savedStep3 = useOnboardingStore((s) => s.mentor.savedStep3)
  const saveMentorStep1 = useOnboardingStore((s) => s.saveMentorStep1)
  const saveMentorStep2 = useOnboardingStore((s) => s.saveMentorStep2)
  const saveMentorStep3 = useOnboardingStore((s) => s.saveMentorStep3)
  const completed = useOnboardingStore((s) => s.mentor.completed)
  const saveMentorCompleted = useOnboardingStore((s) => s.saveMentorCompleted)


  const step1Form = useForm<MentorStep1Values>({
    resolver: zodResolver(mentorStep1Schema),
    mode: 'onTouched',
    defaultValues: {
      bio: savedStep1?.bio ?? '',
      specialization: savedStep1?.specialization ?? '',
    },
  })

  const step2Form = useForm<MentorStep2Values>({
    resolver: zodResolver(mentorStep2Schema),
    mode: 'onTouched',
    defaultValues: {
      skillIds: savedStep2?.skillIds ?? [],
    },
  })

  const step3Form = useForm<MentorStep3Values>({
    resolver: zodResolver(mentorStep3Schema),
    mode: 'onTouched',
    defaultValues: {
      linkedinUrl: savedStep3?.linkedinUrl ?? '',
      cvStorageUrl: savedStep3?.cvStorageUrl ?? '',
      cvFileName: savedStep3?.cvFileName || '',
    },
  })

  const { data: skills, isLoading: isSkillsLoading } = useSkills()

  const { mutateAsync: updateMe, isPending: isUpdating } = useMutation({
    mutationFn: authApi.updateMe,
  })
  const { mutateAsync: setUserSkills, isPending: isSkillsUpdating } = useMutation({
    mutationFn: (ids: number[]) =>
      userSkillsApi.setUserSkills(ids.map((id) => ({ skillId: id, level: 'Beginner' }))),
  })
  const { mutateAsync: createLink, isPending: isLinkUpdating } = useMutation({
    mutationFn: linksApi.create,
  })

  const isPending = isUpdating || isSkillsUpdating || isLinkUpdating
  const progressWidth = `${(step / MENTOR_TOTAL_STEPS) * 100}%`

  function back(): void {
    if (step > 1) setMentorStep((step - 1) as MentorStep)
  }


  async function submitAll(): Promise<void> {
    const { bio, specialization } = step1Form.getValues()
    const { skillIds } = step2Form.getValues()
    const { linkedinUrl, cvStorageUrl } = step3Form.getValues()

    try {
      if (!completed.profile || (!completed.cv && cvStorageUrl)) {
        await updateMe({
          ...(!completed.profile ? { bio, areasOfInterest: specialization } : {}),
          ...(!completed.cv && cvStorageUrl ? { cvUrl: cvStorageUrl } : {})
        })
        if (!completed.profile) saveMentorCompleted('profile', true)
        if (!completed.cv && cvStorageUrl) saveMentorCompleted('cv', true)
      }

      await Promise.all([
        (!completed.skills && skillIds.length > 0) ? setUserSkills(skillIds) : Promise.resolve(),
        !completed.link ? createLink({ url: linkedinUrl, linkType: 'linkedin' }) : Promise.resolve(),
      ])

      if (!completed.skills && skillIds.length > 0) saveMentorCompleted('skills', true)
      if (!completed.link) saveMentorCompleted('link', true)

      resetMentor()
      setMentorStep(4)
    } catch {
      toast.apiError('Xəta baş verdi. Yenidən cəhd edin.')
    }
  }

  const finish = useOnboardingFinish(resetMentor)

  async function next(): Promise<void> {
    if (step === 1) {
      const valid = await step1Form.trigger()
      if (valid) {
        saveMentorStep1(step1Form.getValues())
        setMentorStep(2)
      }
      return
    }
    if (step === 2) {
      const valid = await step2Form.trigger()
      if (valid) {
        saveMentorStep2(step2Form.getValues())
        setMentorStep(3)
      }
      return
    }
    if (step === 3) {
      const valid = await step3Form.trigger()
      if (valid) {
        saveMentorStep3(step3Form.getValues())
        void submitAll()
      }
    }
  }

  return {
    step,
    progressWidth,
    totalSteps: MENTOR_TOTAL_STEPS,
    isPending,
    finish,
    back,
    skills: skills ?? [],
    isSkillsLoading,
    next,
    step1Form,
    step2Form,
    step3Form,
  }
}
