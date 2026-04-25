import { cn } from '@/shared/utils/cn'

interface OutlineButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  variant?: 'light' | 'dark'
  className?: string
}

export function OutlineButton({
  children,
  onClick,
  type = 'button',
  variant = 'light',
  className,
}: OutlineButtonProps): React.JSX.Element {
  const styles =
    variant === 'dark'
      ? 'border border-auth-panel-surface text-white bg-transparent hover:bg-white/5'
      : 'border border-auth-border text-auth-ink bg-white hover:bg-auth-page-muted'

  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        'h-[50px] w-full rounded-xl text-[12px] font-medium transition-colors duration-150 active:scale-[0.98]',
        styles,
        className
      )}
    >
      {children}
    </button>
  )
}

