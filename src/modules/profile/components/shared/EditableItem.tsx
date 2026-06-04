import { Trash2 } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

interface EditableItemProps {
  children: React.ReactNode
  onDelete?: () => void
  isDeleting?: boolean
  className?: string
}

export function EditableItem({
  children,
  onDelete,
  isDeleting,
  className,
}: EditableItemProps): React.JSX.Element {
  return (
    <div className={cn('group relative flex items-start gap-3 rounded-xl border border-[--color-border-soft] bg-[--color-field-bg] p-3', className)}>
      <div className="flex-1 min-w-0">{children}</div>
      {onDelete && (
        <button
          onClick={onDelete}
          disabled={isDeleting}
          aria-label="Sil"
          className="shrink-0 rounded-lg p-1.5 text-[--color-text-muted] opacity-0 transition-all group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDeleting ? (
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Trash2 size={14} />
          )}
        </button>
      )}
    </div>
  )
}
