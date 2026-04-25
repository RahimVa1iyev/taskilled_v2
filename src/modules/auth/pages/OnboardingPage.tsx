import { CheckCircle } from 'lucide-react'

import { AuthLayout } from '@/modules/auth/components/AuthLayout'
import { BackButton } from '@/modules/auth/components/BackButton'
import { useOnboarding } from '@/modules/auth/hooks/useOnboarding'
import { ChipSelector, PrimaryButton } from '@/shared/ui'

const INTERESTS = ['Design', 'Development', 'Marketing', 'Finance', 'Data Science', 'HR', 'Product', 'Sales'] as const
const SKILLS = ['JavaScript', 'Python', 'Figma', 'React', 'Marketing', 'Excel', 'SQL', 'Photoshop'] as const

export function OnboardingPage(): React.JSX.Element {
  const {
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
  } = useOnboarding()

  return (
    <AuthLayout>
      <BackButton />
      <div className="h-[4px] w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: progressWidth }}
        />
      </div>
      <p className="mb-6 mt-1 text-right text-[10px] text-muted-foreground">
        Step {step} of 3
      </p>

      <div key={step} className="animate-slide-in">
        {step === 1 ? (
          <>
            <h2 className="mb-2 text-[13px] font-semibold text-foreground">
              Where are you based?
            </h2>
            <div className="mb-4">
              <label className="mb-[6px] block text-[11px] font-medium text-muted-foreground">
                City
              </label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. London"
                className="h-[50px] w-full rounded-xl border border-border bg-card px-4 text-[12px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <h2 className="mb-2 mt-5 text-[13px] font-semibold text-foreground">
              What interests you?
            </h2>
            <ChipSelector options={[...INTERESTS]} selected={interests} onChange={setInterests} />
          </>
        ) : null}

        {step === 2 ? (
          <>
            <h2 className="mb-2 text-[13px] font-semibold text-foreground">
              Your specialization
            </h2>
            <div className="mb-4">
              <label className="mb-[6px] block text-[11px] font-medium text-muted-foreground">
                Specialization
              </label>
              <input
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="e.g. Frontend Engineering"
                className="h-[50px] w-full rounded-xl border border-border bg-card px-4 text-[12px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <h2 className="mb-2 mt-5 text-[13px] font-semibold text-foreground">
              Top skills
            </h2>
            <ChipSelector options={[...SKILLS]} selected={skills} onChange={setSkills} />
          </>
        ) : null}

        {step === 3 ? (
          <div>
            <CheckCircle className="mx-auto mb-3 h-12 w-12 text-primary" />
            <h2 className="text-center text-[18px] font-bold text-foreground">
              You're all set!
            </h2>
            <p className="mb-6 mt-1 text-center text-[11px] text-muted-foreground">
              Your profile is ready
            </p>
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="mb-1 text-[10px] text-muted-foreground">Role</p>
              <p className="mb-3 text-[12px] font-semibold capitalize text-foreground">
                {role}
              </p>
              <p className="mb-1 text-[10px] text-muted-foreground">City</p>
              <p className="mb-3 text-[12px] font-semibold text-foreground">
                {city || '—'}
              </p>
              <p className="mb-2 text-[10px] text-muted-foreground">Top interests</p>
              <div className="flex flex-wrap gap-2">
                {interests.slice(0, 3).map((i) => (
                  <span
                    key={i}
                    className="rounded-full bg-primary px-3 py-[6px] text-[11px] font-semibold text-primary-foreground"
                  >
                    {i}
                  </span>
                ))}
                {interests.length === 0 ? (
                  <span className="text-[11px] text-muted-foreground">
                    None selected
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-6">
        {step < 3 ? (
          <PrimaryButton
            disabled={!canNext}
            onClick={next}
          >
            Continue
          </PrimaryButton>
        ) : (
          <PrimaryButton onClick={finish}>Enter Taskilled</PrimaryButton>
        )}
        <p className="mt-3 text-center">
          <button
            type="button"
            onClick={skip}
            className="text-[11px] text-muted-foreground underline"
          >
            Skip for now
          </button>
        </p>
      </div>
    </AuthLayout>
  )
}

