import { cn } from '@/shared/utils/cn'

export interface ChipOption {
  id: number
  label: string
}

interface ChipSelectorByIdProps {
  options: ChipOption[]
  selected: number[]
  onChange: (ids: number[]) => void
  maxSelect?: number
  className?: string
}

export function ChipSelectorById({
  options,
  selected,
  onChange,
  maxSelect,
  className,
}: ChipSelectorByIdProps): React.JSX.Element {
  function toggle(id: number): void {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id))
    } else {
      if (maxSelect && selected.length >= maxSelect) return
      onChange([...selected, id])
    }
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map(({ id, label }) => {
        const isSel = selected.includes(id)
        return (
          <button
            key={id}
            type="button"
            onClick={() => toggle(id)}
            className={cn(
              'rounded-full px-3 py-[6px] text-[11px] transition-all duration-150 active:scale-[0.98]',
              isSel
                ? 'bg-auth-accent text-auth-ink font-semibold'
                : 'bg-white border border-auth-border text-auth-text',
            )}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
