import type { ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border-soft)] bg-[var(--color-ghost-bg)] p-12 text-center',
        className
      )}
    >
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-card-bg)] text-[var(--color-text-muted)] shadow-sm">
          {icon}
        </div>
      )}
      <h3 className="mb-2 text-lg font-bold text-[var(--color-foreground)]">{title}</h3>
      {description && (
        <p className="mb-6 max-w-sm text-sm text-[var(--color-text-muted)]">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  )
}
