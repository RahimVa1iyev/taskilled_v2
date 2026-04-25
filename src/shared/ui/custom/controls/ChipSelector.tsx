import { cn } from '@/shared/utils/cn'

interface ChipSelectorProps {
  options: string[]
  selected: string[]
  onChange: (v: string[]) => void
  maxSelect?: number
  className?: string
}

export function ChipSelector({
  options,
  selected,
  onChange,
  maxSelect,
  className,
}: ChipSelectorProps): React.JSX.Element {
  function toggle(opt: string): void {
    if (selected.includes(opt)) onChange(selected.filter((s) => s !== opt))
    else {
      if (maxSelect && selected.length >= maxSelect) return
      onChange([...selected, opt])
    }
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((opt) => {
        const isSel = selected.includes(opt)
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={cn(
              'rounded-full px-3 py-[6px] text-[11px] transition-all duration-150 active:scale-[0.98]',
              isSel
                ? 'bg-auth-accent text-auth-ink font-semibold'
                : 'bg-white border border-auth-border text-auth-text'
            )}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

