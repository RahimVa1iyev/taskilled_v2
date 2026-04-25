import { cn } from '@/shared/utils/cn'

interface SpinnerProps {
  className?: string
  label?: string
}

export function Spinner({ className, label = 'Yüklənir...' }: SpinnerProps): React.JSX.Element {
  return (
    <div
      className={cn('flex min-h-[40vh] items-center justify-center', className)}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="text-muted-foreground">{label}</span>
    </div>
  )
}

