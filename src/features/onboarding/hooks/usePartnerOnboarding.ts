import { useMutation } from '@tanstack/react-query'
import { useOnboardingFinish } from './useOnboardingFinish'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'


import { companyApi } from '@/modules/auth/api/company.api'
import { useCountries, useCities } from '@/shared/hooks/lookup'
import { useOnboardingStore } from '@/features/onboarding/store/onboarding.store'
import { PARTNER_TOTAL_STEPS } from '../constants/usePartnerOnboarding.constants'
import type { PartnerStep, UsePartnerOnboardingResult, PartnerStep1Values, PartnerStep2Values } from '../types/usePartnerOnboarding.types'
import { partnerStep1Schema, partnerStep2Schema } from '../schemas/onboarding.schemas'
import { toast } from '@/shared/lib/toast'

export function usePartnerOnboarding(): UsePartnerOnboardingResult {

  const step = useOnboardingStore((s) => s.partner.step)
  const setPartnerStep = useOnboardingStore((s) => s.setPartnerStep)
  const resetPartnerToStep = useOnboardingStore((s) => s.resetPartnerToStep)
  const resetPartner = useOnboardingStore((s) => s.resetPartner)
  const savedStep1 = useOnboardingStore((s) => s.partner.savedStep1)
  const savePartnerStep1 = useOnboardingStore((s) => s.savePartnerStep1)


  const form = useForm<PartnerStep1Values>({
    resolver: zodResolver(partnerStep1Schema),
    mode: 'onTouched',
    defaultValues: {
      name: savedStep1?.name ?? '',
      taxId: savedStep1?.taxId ?? '',
      contactEmail: savedStep1?.contactEmail ?? '',
      contactPhone: savedStep1?.contactPhone ?? '',
      countryId: savedStep1?.countryId ?? undefined,
      cityId: savedStep1?.cityId ?? undefined,
      industry: savedStep1?.industry ?? '',
    },
  })

  const step2Form = useForm<PartnerStep2Values>({
    resolver: zodResolver(partnerStep2Schema),
    mode: 'onTouched',
    defaultValues: {
      description: '',
      website: '',
      linkedinUrl: '',
      size: '',
    },
  })

  const selectedCountryId = form.watch('countryId')

  const { data: countries, isLoading: isCountriesLoading } = useCountries()

  const { data: cities, isLoading: isCitiesLoading } = useCities(selectedCountryId ?? null)

  const { mutateAsync: createCompany, isPending } = useMutation({
    mutationFn: companyApi.create,
  })

  const progressWidth = step === 1 ? '33%' : step === 2 ? '66%' : '100%'

  function next(): void {
    if (step === 1) {
      form.trigger().then((valid) => {
        if (valid) {
          savePartnerStep1(form.getValues())
          setPartnerStep(2)
        }
      })
    }
  }

  function back(): void {
    if (step > 1) setPartnerStep((step - 1) as PartnerStep)
  }

  function skip(): void {
    step2Form.reset()
    void submitOptional()
  }

  const finish = useOnboardingFinish(resetPartner)

  async function submitOptional(): Promise<void> {
    const values = form.getValues()
    const step2Values = step2Form.getValues()
    try {
      await createCompany({
        name: values.name,
        taxId: values.taxId,
        contactEmail: values.contactEmail,
        contactPhone: values.contactPhone,
        country: values.countryId!,
        city: values.cityId!,
        industry: values.industry,
        description: step2Values.description || null,
        website: step2Values.website || null,
        linkedinUrl: step2Values.linkedinUrl || null,
        size: step2Values.size ? Number(step2Values.size) : null,
      })
      resetPartnerToStep(3)
    } catch {
      toast.apiError('Xəta baş verdi')
    }
  }

  async function submit(): Promise<void> {
    const isValid = await step2Form.trigger()
    if (!isValid) return

    await submitOptional()
  }

  return {
    step,
    progressWidth,
    totalSteps: PARTNER_TOTAL_STEPS,
    finish,
    next,
    back,
    skip,
    countries: countries ?? [],
    isCountriesLoading,
    cities: cities ?? [],
    isCitiesLoading,

    isPending,
    submit,
    form,
    step2Form,
  }
}
