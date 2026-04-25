import { Building2, Check, GraduationCap, Users } from 'lucide-react'

import { AuthLayout } from '@/modules/auth/components/AuthLayout'
import { BackButton } from '@/modules/auth/components/BackButton'
import { useRoleSelection } from '@/modules/auth/hooks/useRoleSelection'
import { cn } from '@/shared/utils/cn'
import { PrimaryButton } from '@/shared/ui'

const ROLES = [
  {
    id: 'intern',
    name: 'Intern',
    desc: 'Join programs, complete tasks, earn certificates',
    Icon: GraduationCap,
  },
  {
    id: 'mentor',
    name: 'Mentor',
    desc: 'Review tasks, give feedback, guide interns',
    Icon: Users,
  },
  {
    id: 'partner',
    name: 'Partner',
    desc: 'Create programs, hire interns, build talent',
    Icon: Building2,
  },
] as const

export function RolePage(): React.JSX.Element {
  const { selected, select, continueNext } = useRoleSelection()

  return (
    <AuthLayout>
      <BackButton />
      <h1 className="text-[16px] font-bold text-foreground">I am a...</h1>
      <p className="mb-5 mt-1 text-[11px] text-muted-foreground">
        Choose your role to get started
      </p>

      <div className="flex flex-col gap-2">
        {ROLES.map(({ id, name, desc, Icon }) => {
          const sel = selected === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => select(id)}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-2xl border-2 bg-card p-3 text-left transition-all duration-150 active:scale-[0.98]',
                sel ? 'border-primary bg-primary/10' : 'border-transparent'
              )}
            >
              <div
                className={cn(
                  'flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-[10px]',
                  sel ? 'bg-primary' : 'bg-muted'
                )}
              >
                <Icon
                  className={cn('h-4 w-4', sel ? 'text-primary-foreground' : 'text-muted-foreground')}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold text-foreground">
                  {name}
                </div>
                <div className="mt-[2px] text-[10px] text-muted-foreground">
                  {desc}
                </div>
              </div>
              {sel ? (
                <div className="ml-auto flex h-[17px] w-[17px] flex-shrink-0 items-center justify-center rounded-full bg-primary">
                  <Check className="h-2 w-2 text-primary-foreground" strokeWidth={4} />
                </div>
              ) : (
                <div className="ml-auto h-[17px] w-[17px] flex-shrink-0 rounded-full border border-border" />
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-6">
        <PrimaryButton disabled={!selected} onClick={continueNext}>
          Continue
        </PrimaryButton>
      </div>
    </AuthLayout>
  )
}

