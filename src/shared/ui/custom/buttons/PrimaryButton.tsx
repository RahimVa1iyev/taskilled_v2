import { cn } from '@/shared/utils/cn'

interface PrimaryButtonProps {
  children: React.ReactNode
  onClick?: () => void
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
}

export function PrimaryButton({
  children,
  onClick,
  loading = false,
  disabled = false,
  type = 'button',
  className,
}: PrimaryButtonProps): React.JSX.Element {
  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={cn(
        'h-[50px] w-full rounded-xl bg-auth-accent text-[13px] font-bold text-auth-ink transition-colors duration-150 hover:bg-auth-accent-hover active:scale-[0.98]',
        isDisabled && 'pointer-events-none cursor-not-allowed opacity-50',
        className
      )}
    >
      {loading ? (
        <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-auth-ink/70 border-t-transparent" />
      ) : (
        children
      )}
    </button>
  )
}

