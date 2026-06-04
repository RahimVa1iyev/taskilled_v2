interface FieldLabelProps {
  htmlFor: string
  label: string
  required?: boolean
  hint?: string
}

export function FieldLabel({ htmlFor, label, required, hint }: FieldLabelProps): React.JSX.Element {
  return (
    <label htmlFor={htmlFor} className="mb-[6px] block text-[11px] font-medium uppercase tracking-[0.15em] text-[--color-text-muted]">
      {label}
      {required ? <span className="text-required" aria-hidden="true"> *</span> : null}
      {required ? <span className="sr-only">(mütləq)</span> : null}
      {hint ? <span className="ml-1 text-[10px] text-muted-foreground">({hint})</span> : null}
    </label>
  )
}
