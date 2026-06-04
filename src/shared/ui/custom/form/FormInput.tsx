import { useId } from 'react'
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form'

import { cn } from '@/shared/utils/cn'
import { FieldLabel } from './FieldLabel'

interface FormInputProps<TFieldValues extends FieldValues> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<TFieldValues, any, any>
  name: FieldPath<TFieldValues>
  label: string
  type?: string
  placeholder?: string
  autoComplete?: string
  required?: boolean
  className?: string
}

export function FormInput<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  type = 'text',
  placeholder,
  autoComplete,
  required,
  className,
}: FormInputProps<TFieldValues>): React.JSX.Element {
  const id = useId()
  const { field, fieldState } = useController({ control, name })

  return (
    <div className={cn(className)}>
      <FieldLabel htmlFor={id} label={label} required={required} />

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={fieldState.invalid || undefined}
        className={cn(
          'h-[48px] w-full rounded-[14px] bg-[--color-field-bg] px-4 text-[14px] text-foreground outline-none transition-colors placeholder:text-[--color-text-placeholder]',
          'border border-[--color-border-soft] focus:border-primary focus:ring-1 focus:ring-primary focus:bg-[--color-card-bg]',
          fieldState.error && 'border-destructive'
        )}
        {...field}
      />

      {fieldState.error?.message ? (
        <p className="mt-1 text-[11px] text-destructive" aria-live="polite">
          {fieldState.error.message}
        </p>
      ) : null}
    </div>
  )
}

