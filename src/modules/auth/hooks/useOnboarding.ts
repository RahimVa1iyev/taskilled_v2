import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/shared/constants/routes'

type Step = 1 | 2 | 3

interface UseOnboardingResult {
  step: Step
  progressWidth: string
  city: string
  setCity: (v: string) => void
  specialization: string
  setSpecialization: (v: string) => void
  interests: string[]
  setInterests: (v: string[]) => void
  skills: string[]
  setSkills: (v: string[]) => void
  canNext: boolean
  role: string
  next: () => void
  finish: () => void
  skip: () => void
}

export function useOnboarding(): UseOnboardingResult {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>(1)
  const [interests, setInterests] = useState<string[]>([])
  const [skills, setSkills] = useState<string[]>([])
  const [city, setCity] = useState('')
  const [specialization, setSpecialization] = useState('')

  const role =
    typeof window !== 'undefined' ? sessionStorage.getItem('role') || 'intern' : 'intern'

  const progressWidth = useMemo(() => {
    const widths = { 1: '33%', 2: '66%', 3: '100%' } as const
    return widths[step]
  }, [step])

  const canNext = step === 1 ? interests.length >= 1 && city.trim().length > 0 : true

  function next(): void {
    setStep((s) => (s === 1 ? 2 : 3))
  }

  function finish(): void {
    navigate(ROUTES.HOME, { replace: true })
  }

  function skip(): void {
    navigate(ROUTES.HOME, { replace: true })
  }

  return {
    step,
    progressWidth,
    city,
    setCity,
    specialization,
    setSpecialization,
    interests,
    setInterests,
    skills,
    setSkills,
    canNext,
    role,
    next,
    finish,
    skip,
  }
}

