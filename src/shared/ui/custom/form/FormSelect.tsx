import { useId } from 'react'
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form'

import { cn } from '@/shared/utils/cn'
import { FieldLabel } from './FieldLabel'

interface SelectOption {
  value: number | string
  label: string
}

interface FormSelectProps<TFieldValues extends FieldValues> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<TFieldValues, any, any>
  name: FieldPath<TFieldValues>
  label: string
  options: SelectOption[]
  placeholder?: string
  required?: boolean
  disabled?: boolean
  loading?: boolean
  className?: string
  onChange?: (val: string | number | undefined) => void
}

export function FormSelect<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder,
  required,
  disabled,
  loading,
  className,
  onChange,
}: FormSelectProps<TFieldValues>): React.JSX.Element {
  const id = useId()
  const { field, fieldState } = useController({ control, name })

  return (
    <div className={cn(className)}>
      <FieldLabel htmlFor={id} label={label} required={required} />
      {loading ? (
        <div className="h-[50px] w-full animate-shimmer rounded-xl bg-card border border-border" />
      ) : (
        <div className="relative">
          <select
            id={id}
            disabled={disabled}
            aria-invalid={fieldState.invalid || undefined}
            className={cn(
              'h-[48px] w-full rounded-[14px] bg-[--color-field-bg] pl-4 pr-10',
              'text-[14px] text-foreground outline-none transition-colors',
              'appearance-none cursor-pointer',
              'border border-[--color-border-soft] focus:border-primary focus:ring-1 focus:ring-primary focus:bg-[--color-card-bg]',
              fieldState.error && 'border-destructive',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            {...field}
            value={field.value ?? ''}
            onChange={(e) => {
              const val = e.target.value
              const finalVal = val === '' ? undefined : isNaN(Number(val)) ? val : Number(val)
              field.onChange(finalVal)
              onChange?.(finalVal)
            }}
          >
            <option value="" disabled>
              {placeholder ?? 'Select...'}
            </option>
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {/* Custom arrow */}
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <svg
              width="16" height="16" viewBox="0 0 16 16"
              fill="none" xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground"
              />
            </svg>
          </div>
        </div>
      )}
      {fieldState.error?.message ? (
        <p className="mt-1 text-[11px] text-destructive" aria-live="polite">
          {fieldState.error.message}
        </p>
      ) : null}
    </div>
  )
}
