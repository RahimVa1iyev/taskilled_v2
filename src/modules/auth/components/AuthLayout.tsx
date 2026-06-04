import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { ROUTES } from '@/shared/constants/routes'
import { cn } from '@/shared/utils/cn'
import { AuthLeftPanel } from '@/modules/auth/components/AuthLeftPanel'
import { LogoPill } from '@/modules/auth/components/LogoPill'

interface AuthLayoutProps {
  children: ReactNode
  className?: string
  hideBackLink?: boolean
}

export function AuthLayout({ children, className, hideBackLink }: AuthLayoutProps): React.JSX.Element {
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <AuthLeftPanel />

      <div className="flex min-h-dvh flex-1 flex-col bg-auth-page px-6 pb-8 pt-12 lg:items-center lg:justify-center lg:px-8">
        <div className="mb-8 lg:hidden">
          <LogoPill size="sm" />
        </div>

        <div className="flex flex-1 flex-col justify-center lg:flex-none lg:w-full">
          <div className={cn('relative mx-auto flex w-full max-w-[340px] flex-col', className)}>
            {!hideBackLink && (
              <Link
                to={ROUTES.ROOT}
                className="mb-6 inline-flex items-center gap-1.5 self-start text-[11px] text-auth-text transition-colors duration-150 hover:text-auth-ink lg:mb-8 lg:self-end"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to home
              </Link>
            )}

            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

