import { useId } from 'react'
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form'

import { cn } from '@/shared/utils/cn'

interface FormCheckboxProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label: React.ReactNode
  className?: string
}

export function FormCheckbox<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  className,
}: FormCheckboxProps<TFieldValues>): React.JSX.Element {
  const id = useId()
  const { field, fieldState } = useController({ control, name })

  return (
    <div className={cn('mb-2 mt-4', className)}>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-2 text-[11px] text-auth-text">
        <input
          id={id}
          type="checkbox"
          checked={Boolean(field.value)}
          onChange={(e) => field.onChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-auth-accent"
        />
        <span>{label}</span>
      </label>
      {fieldState.error?.message ? (
        <p className="mt-1 text-[11px] text-destructive" aria-live="polite">
          {fieldState.error.message}
        </p>
      ) : null}
    </div>
  )
}

