import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

const LANGUAGES = [
  { code: 'az', label: 'AZ', flag: '🇦🇿' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'ru', label: 'RU', flag: '🇷🇺' },
] as const

export type LangCode = typeof LANGUAGES[number]['code']

export interface LanguageSwitcherProps {
  variant?: 'dark' | 'light'
  className?: string
}

export function LanguageSwitcher({ variant = 'light', className }: LanguageSwitcherProps) {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Derive current language
  const currentLangCode = i18n.language?.slice(0, 2) || 'en'
  const current = LANGUAGES.find(l => l.code === currentLangCode) || LANGUAGES[1] // fallback to EN

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors',
          variant === 'dark'
            ? 'text-[var(--color-dark-muted)] hover:text-white hover:bg-[var(--color-dark-surface)]'
            : 'text-[var(--color-text-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-muted)]'
        )}
      >
        <span>{current.flag}</span>
        <span>{current.label}</span>
        <ChevronDown size={14} className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className={cn(
          'absolute right-0 top-full mt-1 min-w-[120px] rounded-xl overflow-hidden z-50',
          variant === 'dark'
            ? 'bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)]'
            : 'bg-white border border-[var(--color-border-soft)] shadow-lg'
        )}>
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              type="button"
              onClick={() => { void i18n.changeLanguage(lang.code); setOpen(false) }}
              className={cn(
                'w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors',
                lang.code === current.code
                  ? 'text-[var(--color-brand)] font-semibold'
                  : variant === 'dark'
                    ? 'text-[var(--color-dark-muted)] hover:text-white hover:bg-white/5'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-muted)]'
              )}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
              {lang.code === current.code && (
                <Check size={14} className="ml-auto text-[var(--color-brand)]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
