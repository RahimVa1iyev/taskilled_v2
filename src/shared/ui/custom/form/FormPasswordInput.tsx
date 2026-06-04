import { useId, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form'

import { cn } from '@/shared/utils/cn'
import { FieldLabel } from './FieldLabel'

interface FormPasswordInputProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label: string
  placeholder?: string
  autoComplete?: string
  required?: boolean
  className?: string
}

export function FormPasswordInput<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  autoComplete,
  required,
  className,
}: FormPasswordInputProps<TFieldValues>): React.JSX.Element {
  const id = useId()
  const [show, setShow] = useState(false)
  const { field, fieldState } = useController({ control, name })

  return (
    <div className={cn(className)}>
      <FieldLabel htmlFor={id} label={label} required={required} />

      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={fieldState.invalid || undefined}
          className={cn(
            'h-[50px] w-full rounded-xl border bg-card px-4 pr-12 text-[12px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:ring-1',
            fieldState.error
              ? 'border-destructive focus:border-destructive focus:ring-destructive'
              : 'border-border focus:border-primary focus:ring-primary'
          )}
          {...field}
        />
        <button
          type="button"
          aria-label={show ? 'Şifrəni gizlət' : 'Şifrəni göstər'}
          onClick={() => setShow((v) => !v)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {fieldState.error?.message ? (
        <p className="mt-1 text-[11px] text-destructive" aria-live="polite">
          {fieldState.error.message}
        </p>
      ) : null}
    </div>
  )
}

