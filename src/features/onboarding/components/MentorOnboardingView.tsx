import { CheckCircle } from 'lucide-react'

import { AuthLayout } from '@/modules/auth/components/AuthLayout'
import { BackButton } from '@/modules/auth/components/BackButton'
import { useMentorOnboarding } from '@/features/onboarding/hooks/useMentorOnboarding'
import { ProgressBar } from './ProgressBar'
import { ChipSelectorById, PrimaryButton, FormInput, FormTextarea, CvUpload } from '@/shared/ui'

export function MentorOnboardingView(): React.JSX.Element {
  const {
    step,
    progressWidth,
    totalSteps,
    isPending,
    finish,
    back,
    skills,
    isSkillsLoading,
    next,
    step1Form,
    step2Form,
    step3Form,
  } = useMentorOnboarding()

  return (
    <AuthLayout>
      {step > 1 && step < 4 ? <BackButton onClick={back} /> : null}
      <ProgressBar width={progressWidth} step={step} total={totalSteps} />

      <div key={step} className="animate-slide-in">
        {step === 1 ? (
          <>
            <h2 className="mb-2 text-[13px] font-semibold text-foreground">About you</h2>
            <div className="mb-4">
              <FormTextarea
                control={step1Form.control}
                name="bio"
                label="Bio"
                required
                hint="min 50 chars"
                showCount
                rows={4}
                placeholder="I'm a backend engineer with 3+ years of experience. I enjoy mentoring junior developers..."
              />
            </div>
            <div>
              <FormInput
                control={step1Form.control}
                name="specialization"
                label="Specialization"
                required
                placeholder="e.g. Backend Engineering"
              />
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <h2 className="mb-2 text-[13px] font-semibold text-foreground">
              Your skills <span className="text-[10px] text-muted-foreground">(min 1)</span>
            </h2>
            {isSkillsLoading ? (
              <div className="h-[80px] w-full animate-shimmer rounded-xl" />
            ) : (
              <ChipSelectorById
                options={skills.map((s) => ({ id: s.id, label: s.name }))}
                selected={step2Form.watch('skillIds')}
                onChange={(ids) => {
                  step2Form.setValue('skillIds', ids, { shouldValidate: true })
                }}
              />
            )}
            {step2Form.formState.errors.skillIds?.message && <p className="mt-1 text-[11px] text-destructive">{step2Form.formState.errors.skillIds.message}</p>}
          </>
        ) : null}

        {step === 3 ? (
          <>
            <h2 className="mb-2 text-[13px] font-semibold text-foreground">Links</h2>
            <div className="flex flex-col gap-3">
              <div>
                <FormInput
                  control={step3Form.control}
                  name="linkedinUrl"
                  label="LinkedIn URL"
                  required
                  placeholder="https://linkedin.com/in/john-doe"
                />
              </div>
              <div>
                <label className="mb-[6px] block text-[11px] font-medium text-muted-foreground">
                  CV <span className="text-required" aria-hidden="true">*</span>
                </label>
                <CvUpload
                  initialFileName={step3Form.watch('cvFileName') || null}
                  onSuccess={(result) => {
                    step3Form.setValue('cvStorageUrl', result.storageUrl, { shouldValidate: true })
                    step3Form.setValue('cvFileName', result.filePath, { shouldValidate: true })
                  }}
                  error={step3Form.formState.errors.cvStorageUrl?.message}
                />
              </div>
            </div>
          </>
        ) : null}

        {step === 4 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="mx-auto mb-3 h-12 w-12 text-primary" />
            <h2 className="text-center text-[18px] font-bold text-foreground">You're all set!</h2>
            <p className="mb-6 mt-1 text-center text-[11px] text-muted-foreground">
              Your profile is under review
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-6">
        {step < 4 ? (
          <PrimaryButton
            disabled={isPending}
            loading={isPending}
            onClick={() => {
              void next()
            }}
          >
            {step === 3 ? 'Finish' : 'Continue'}
          </PrimaryButton>
        ) : (
          <PrimaryButton onClick={finish}>Enter Taskilled</PrimaryButton>
        )}
      </div>
    </AuthLayout>
  )
}
