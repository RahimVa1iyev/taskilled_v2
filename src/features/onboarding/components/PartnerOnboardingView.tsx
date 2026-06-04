import { CheckCircle } from 'lucide-react'

import { AuthLayout } from '@/modules/auth/components/AuthLayout'
import { BackButton } from '@/modules/auth/components/BackButton'
import { usePartnerOnboarding } from '@/features/onboarding/hooks/usePartnerOnboarding'
import { ProgressBar } from './ProgressBar'
import { PrimaryButton, FormInput, FormSelect, FormTextarea } from '@/shared/ui'

export function PartnerOnboardingView(): React.JSX.Element {
  const {
    step,
    progressWidth,
    totalSteps,
    next,
    back,
    skip,
    submit,
    finish,
    isPending,
    countries,
    isCountriesLoading,
    cities,
    isCitiesLoading,

    form,
    step2Form,
  } = usePartnerOnboarding()

  return (
    <AuthLayout>
      {step > 1 && step < 3 ? <BackButton onClick={back} /> : null}
      <ProgressBar width={progressWidth} step={step} total={totalSteps} />

      <div key={step} className="animate-slide-in">
        {step === 1 ? (
          <>
            <h2 className="mb-1 text-[16px] font-bold text-foreground">Company details</h2>
            <p className="mb-5 text-[11px] text-muted-foreground">Tell us about your company</p>

            <div className="flex flex-col gap-3">
              <FormInput
                control={form.control}
                name="name"
                label="Company name"
                required
                placeholder="e.g. Azercell Telekom LLC"
              />

              <FormInput
                control={form.control}
                name="taxId"
                label="Tax ID"
                required
                placeholder="e.g. 1234567890"
              />

              <FormInput
                control={form.control}
                name="contactEmail"
                type="email"
                label="Contact email"
                required
                placeholder="hr@company.com"
              />

              <FormInput
                control={form.control}
                name="contactPhone"
                label="Contact phone"
                required
                placeholder="+994 50 123 45 67"
              />

              <FormSelect
                control={form.control}
                name="countryId"
                label="Country"
                required
                loading={isCountriesLoading}
                placeholder="Select country"
                options={countries.map((c) => ({ value: c.id, label: c.name }))}
                onChange={(val) => {
                  form.setValue('countryId', Number(val), { shouldValidate: true })
                  form.resetField('cityId')
                }}
              />

              <FormSelect
                control={form.control}
                name="cityId"
                label="City"
                required
                loading={isCitiesLoading}
                placeholder="Select city"
                disabled={!form.watch('countryId')}
                options={cities.map((c) => ({ value: c.id, label: c.name }))}
              />

              <FormInput
                control={form.control}
                name="industry"
                label="Industry"
                required
                placeholder="e.g. Information Technology"
              />
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <h2 className="mb-1 text-[16px] font-bold text-foreground">More about your company</h2>
            <p className="mb-5 text-[11px] text-muted-foreground">
              Optional — you can skip this step
            </p>

            <div className="flex flex-col gap-3">
              <FormTextarea
                control={step2Form.control}
                name="description"
                label="Description"
                placeholder="Brief company description..."
                rows={3}
                className="resize-none"
              />

              <FormInput
                control={step2Form.control}
                name="website"
                label="Website"
                placeholder="https://..."
              />

              <FormInput
                control={step2Form.control}
                name="linkedinUrl"
                label="LinkedIn URL"
                placeholder="https://linkedin.com/company/..."
              />

              <FormSelect
                control={step2Form.control}
                name="size"
                label="Company size"
                placeholder="Select company size"
                options={[
                  { value: '1', label: '1–10' },
                  { value: '11', label: '11–50' },
                  { value: '51', label: '51–200' },
                  { value: '201', label: '201–500' },
                  { value: '500', label: '500+' },
                ]}
              />
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="mx-auto mb-3 h-12 w-12 text-primary" />
            <h2 className="text-center text-[18px] font-bold text-foreground">
              Application submitted!
            </h2>
            <p className="mb-6 mt-1 text-center text-[11px] text-muted-foreground">
              We'll review your company details shortly
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-6">
        {step === 1 ? (
          <PrimaryButton disabled={isPending} loading={isPending} onClick={() => void next()}>
            Continue
          </PrimaryButton>
        ) : step === 2 ? (
          <>
            <PrimaryButton
              disabled={isPending}
              loading={isPending}
              onClick={() => {
                void submit()
              }}
            >
              Submit
            </PrimaryButton>
            <p className="mt-3 text-center">
              <button
                type="button"
                onClick={skip}
                className="text-[11px] text-muted-foreground underline"
              >
                Skip for now
              </button>
            </p>
          </>
        ) : (
          <PrimaryButton onClick={() => void finish()}>Enter Taskilled</PrimaryButton>
        )}
      </div>
    </AuthLayout>
  )
}
