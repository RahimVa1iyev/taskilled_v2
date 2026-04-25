import { useId } from 'react'
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form'

import { cn } from '@/shared/utils/cn'

interface FormInputProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
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
    <div className={cn('mb-4', className)}>
      <label htmlFor={id} className="mb-[6px] block text-[11px] font-medium text-auth-text">
        {label}{' '}
        {required ? (
          <>
            <span className="text-required" aria-hidden="true">*</span>
            <span className="sr-only">(mütləq)</span>
          </>
        ) : null}
      </label>

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={fieldState.invalid || undefined}
        className={cn(
          'h-[50px] w-full rounded-xl border bg-white px-4 text-[12px] text-auth-ink outline-none transition-colors placeholder:text-auth-placeholder focus:ring-1',
          fieldState.error
            ? 'border-destructive focus:border-destructive focus:ring-destructive'
            : 'border-auth-border focus:border-auth-accent focus:ring-auth-accent'
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

