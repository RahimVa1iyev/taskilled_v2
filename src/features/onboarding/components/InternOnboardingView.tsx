import { CheckCircle } from 'lucide-react'

import { AuthLayout } from '@/modules/auth/components/AuthLayout'
import { BackButton } from '@/modules/auth/components/BackButton'
import { useInternOnboarding } from '@/features/onboarding/hooks/useInternOnboarding'
import { ProgressBar } from './ProgressBar'
import { ChipSelectorById, PrimaryButton, FormSelect, FormInput } from '@/shared/ui'

export function InternOnboardingView(): React.JSX.Element {
  const {
    step,
    progressWidth,
    totalSteps,
    isPending,
    back,
    cities,
    isCitiesLoading,
    interests,
    isInterestsLoading,
    skills,
    isSkillsLoading,
    next,
    finish,
    skip,
    form,
  } = useInternOnboarding()

  return (
    <AuthLayout>
      {step > 1 ? <BackButton onClick={back} /> : null}
      <ProgressBar width={progressWidth} step={step} total={totalSteps} />

      <div key={step} className="animate-slide-in">
        {step === 1 ? (
          <>
            <h2 className="mb-2 text-[13px] font-semibold text-foreground">
              Where are you based?
            </h2>
            <div className="mb-4">
              <FormSelect
                control={form.control}
                name="cityId"
                label="City"
                required
                loading={isCitiesLoading}
                placeholder="Select your city"
                options={cities.map((c) => ({ value: c.id, label: c.name }))}
                onChange={(val) => {
                  form.setValue('cityId', Number(val), { shouldValidate: true })
                }}
              />
            </div>

            <h2 className="mb-2 mt-5 text-[13px] font-semibold text-foreground">
              What interests you?
            </h2>
            {isInterestsLoading ? (
              <div className="h-[80px] w-full animate-shimmer rounded-xl" />
            ) : (
              <ChipSelectorById
                options={interests.map((i) => ({ id: i.id, label: i.nameEn }))}
                selected={form.watch('interestIds')}
                onChange={(ids) => {
                  form.setValue('interestIds', ids, { shouldValidate: true })
                }}
              />
            )}
            {form.formState.errors.interestIds?.message && <p className="mt-1 text-[11px] text-destructive">{form.formState.errors.interestIds.message}</p>}
          </>
        ) : null}

        {step === 2 ? (
          <>
            <h2 className="mb-2 text-[13px] font-semibold text-foreground">
              Your specialization
            </h2>
            <div className="mb-4">
              <FormInput
                control={form.control}
                name="areasOfInterest"
                label="Specialization"
                placeholder="e.g. Frontend Engineering"
              />
            </div>
            <h2 className="mb-2 mt-5 text-[13px] font-semibold text-foreground">Top skills</h2>
            {isSkillsLoading ? (
              <div className="h-[80px] w-full animate-shimmer rounded-xl" />
            ) : (
              <ChipSelectorById
                options={skills.map((s) => ({ id: s.id, label: s.name }))}
                selected={form.watch('skillIds')}
                onChange={(ids) => {
                  form.setValue('skillIds', ids, { shouldValidate: true })
                }}
              />
            )}
            {form.formState.errors.skillIds?.message && (
              <p className="mt-1 text-[11px] text-destructive">
                {form.formState.errors.skillIds.message}
              </p>
            )}
          </>
        ) : null}

        {step === 3 ? (
          <div>
            <CheckCircle className="mx-auto mb-3 h-12 w-12 text-primary" />
            <h2 className="text-center text-[18px] font-bold text-foreground">You're all set!</h2>
            <p className="mb-6 mt-1 text-center text-[11px] text-muted-foreground">
              Your profile is ready
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-6">
        {step < 3 ? (
          <PrimaryButton disabled={isPending} loading={isPending} onClick={() => void next()}>
            Continue
          </PrimaryButton>
        ) : (
          <PrimaryButton loading={isPending} onClick={finish}>
            Enter Taskilled
          </PrimaryButton>
        )}
        {step === 2 ? (
          <p className="mt-3 text-center">
            <button
              type="button"
              onClick={skip}
              className="text-[11px] text-muted-foreground underline"
            >
              Skip for now
            </button>
          </p>
        ) : null}
      </div>
    </AuthLayout>
  )
}
