import { useId } from 'react'
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form'

import { cn } from '@/shared/utils/cn'
import { FieldLabel } from './FieldLabel'

interface FormTextareaProps<TFieldValues extends FieldValues> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<TFieldValues, any, any>
  name: FieldPath<TFieldValues>
  label: string
  placeholder?: string
  required?: boolean
  rows?: number
  hint?: string
  showCount?: boolean
  className?: string
}

export function FormTextarea<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  required,
  rows = 4,
  hint,
  showCount,
  className,
}: FormTextareaProps<TFieldValues>): React.JSX.Element {
  const id = useId()
  const { field, fieldState } = useController({ control, name })

  return (
    <div className={cn(className)}>
      <FieldLabel htmlFor={id} label={label} required={required} hint={hint} />
      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={fieldState.invalid || undefined}
        className={cn(
          'w-full rounded-[14px] bg-[--color-field-bg] px-4 py-3 text-[14px] text-foreground outline-none transition-colors placeholder:text-[--color-text-placeholder] resize-none',
          'border border-[--color-border-soft] focus:border-primary focus:ring-1 focus:ring-primary focus:bg-[--color-card-bg]',
          fieldState.error && 'border-destructive'
        )}
        {...field}
      />
      {showCount ? (
        <p className="mt-1 text-right text-[10px] text-muted-foreground">
          {String(field.value || '').length} / 50+
        </p>
      ) : null}
      {fieldState.error?.message ? (
        <p className="mt-1 text-[11px] text-destructive" aria-live="polite">
          {fieldState.error.message}
        </p>
      ) : null}
    </div>
  )
}
