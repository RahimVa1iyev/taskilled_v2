import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { cn } from '@/shared/utils/cn'

interface BackButtonProps {
  className?: string
}

export function BackButton({ className }: BackButtonProps): React.JSX.Element {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
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

