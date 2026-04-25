import { cn } from '@/shared/utils/cn'

interface PasswordStrengthProps {
  password: string
  className?: string
}

function getStrength(pw: string): number {
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/\d/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}

export function PasswordStrength({
  password,
  className,
}: PasswordStrengthProps): React.JSX.Element {
  const score = getStrength(password)

  return (
    <div className={cn('mb-2 mt-[-4px] flex gap-[3px]', className)}>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            'h-[3px] flex-1 rounded-full',
            i < score ? 'bg-auth-accent' : 'bg-auth-border'
          )}
        />
      ))}
    </div>
  )
}

