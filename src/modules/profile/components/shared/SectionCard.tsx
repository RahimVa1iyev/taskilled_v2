import { Pencil, X } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

interface SectionCardProps {
  id?: string
  title: string
  description?: string
  icon?: React.ReactNode
  isEditing?: boolean
  onEdit?: () => void
  editLabel?: string
  headerRight?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function SectionCard({
  id,
  title,
  description,
  icon,
  isEditing,
  onEdit,
  editLabel = 'Edit',
  headerRight,
  children,
  className,
}: SectionCardProps): React.JSX.Element {
  return (
    <section
      id={id}
      className={cn(
        'rounded-[20px] p-6 lg:p-8',
        className
      )}
      style={{
        backgroundColor: 'var(--color-card-bg)',
        border: '1px solid var(--color-card-border)',
      }}
    >
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            {icon && <span style={{ color: 'var(--color-brand-text)' }}>{icon}</span>}
            <h2 className="text-base font-bold tracking-tight" style={{ color: 'var(--color-sidebar-text)' }}>{title}</h2>
          </div>
          {description && (
            <p className="mt-1 text-[13px] leading-relaxed" style={{ color: 'var(--color-sidebar-text-muted)' }}>
              {description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {headerRight}
          {onEdit && (
            <button
              onClick={onEdit}
              aria-label={isEditing ? 'Cancel Edit' : editLabel}
              className={cn(
                "flex items-center gap-1.5 rounded-[12px] px-4 py-2 text-[13px] font-bold transition-all cursor-pointer border border-transparent",
                isEditing 
                  ? "bg-red-50 text-red-600 hover:bg-red-500 hover:text-white shadow-sm border-red-100" 
                  : "bg-[--color-ghost-bg] text-[--color-sidebar-text] hover:border-[--color-border-soft] hover:shadow-sm"
              )}
            >
              {isEditing ? <X size={14} strokeWidth={2.5} /> : <Pencil size={14} />}
              {isEditing ? 'Bağla' : editLabel}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={cn("transition-all duration-300", isEditing ? "opacity-100" : "opacity-100")}>
        {children}
      </div>
    </section>
  )
}

