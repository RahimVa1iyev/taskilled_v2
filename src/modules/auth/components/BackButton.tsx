import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { cn } from '@/shared/utils/cn'

interface BackButtonProps {
  className?: string
  /** Veriləndə `navigate(-1)` əvəzinə bu çağırılır (məs. onboarding addımları). */
  onClick?: () => void
}

export function BackButton({ className, onClick }: BackButtonProps): React.JSX.Element {
  const navigate = useNavigate()

  function handleClick(): void {
    if (onClick) {
      onClick()
      return
    }
    navigate(-1)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'mb-4 inline-flex items-center gap-1.5 self-start text-[11px] font-semibold text-auth-text hover:text-auth-ink',
        className
      )}
    >
      <ArrowLeft className="h-3 w-3" />
      Back
    </button>
  )
}

