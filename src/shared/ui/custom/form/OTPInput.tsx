import { useRef, type ChangeEvent, type ClipboardEvent, type KeyboardEvent } from 'react'

import { cn } from '@/shared/utils/cn'

interface OTPInputProps {
  value: string[]
  onChange: (v: string[]) => void
  error?: boolean
  className?: string
}

export function OTPInput({
  value,
  onChange,
  error = false,
  className,
}: OTPInputProps): React.JSX.Element {
  const refs = useRef<Array<HTMLInputElement | null>>([])

  function handleChange(i: number, e: ChangeEvent<HTMLInputElement>): void {
    const v = e.target.value.replace(/\D/g, '').slice(-1)
    const next = [...value]
    next[i] = v
    onChange(next)
    if (v && i < 5) refs.current[i + 1]?.focus()
  }

  function handleKey(i: number, e: KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Backspace' && !value[i] && i > 0) {
      refs.current[i - 1]?.focus()
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>): void {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const next = Array(6).fill('') as string[]
    for (let i = 0; i < text.length; i++) next[i] = text[i]
    onChange(next)
    refs.current[Math.min(text.length, 5)]?.focus()
  }

  return (
    <div
      className={cn(
        'flex justify-center gap-[6px]',
        error && 'animate-shake',
        className
      )}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          className={cn(
            'h-12 w-10 rounded-xl border bg-white text-center text-lg font-bold text-auth-ink outline-none focus:ring-1',
            error
              ? 'border-destructive focus:border-destructive focus:ring-destructive'
              : 'border-auth-border focus:border-auth-accent focus:ring-auth-accent'
          )}
          aria-label={`OTP digit ${i + 1}`}
        />
      ))}
    </div>
  )
}

