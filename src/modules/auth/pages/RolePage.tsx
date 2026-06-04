import { Check } from 'lucide-react'

import { AuthLayout } from '@/modules/auth/components/AuthLayout'
import { useRoleSelection } from '@/modules/auth/hooks/useRoleSelection'
import { ROLE_ICON, ROLE_DESC } from '@/modules/auth/constants/role.constants'
import type { RoleId } from '@/modules/auth/types/auth.types'
import { cn } from '@/shared/utils/cn'
import { PrimaryButton } from '@/shared/ui'

export function RolePage(): React.JSX.Element {
  const { roles, isLoadingRoles, hasRoleLoadError, selected, select, continueNext, isPending } = useRoleSelection()

  return (
    <AuthLayout>
      <h1 className="text-[16px] font-bold text-foreground">I am a...</h1>
      <p className="mb-5 mt-1 text-[11px] text-muted-foreground">
        Choose your role to get started
      </p>

      <div className="flex flex-col gap-2">
        {isLoadingRoles ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-[62px] w-full animate-shimmer rounded-2xl" />
          ))
        ) : hasRoleLoadError ? (
          <div className="py-4 text-center text-[12px] text-destructive">
            Rollar yüklənə bilmədi, yenidən cəhd edin
          </div>
        ) : (
          roles.map(({ name, displayName }) => {
              const sel = selected === name
              const Icon = ROLE_ICON[name as RoleId]
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => select(name)}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-2xl border-2 bg-card p-3 text-left transition-all duration-150 active:scale-[0.98]',
                    sel ? 'border-primary bg-primary/10' : 'border-transparent',
                  )}
                >
                  <div
                    className={cn(
                      'flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-[10px]',
                      sel ? 'bg-primary' : 'bg-muted',
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4',
                        sel ? 'text-primary-foreground' : 'text-muted-foreground',
                      )}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold text-foreground">{displayName}</div>
                    <div className="mt-[2px] text-[10px] text-muted-foreground">
                      {ROLE_DESC[name as RoleId]}
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
          })
        )}
      </div>

      <div className="mt-6">
        <PrimaryButton
          disabled={!selected || isPending || hasRoleLoadError}
          loading={isPending}
          onClick={continueNext}
        >
          Continue
        </PrimaryButton>
      </div>
    </AuthLayout>
  )
}
