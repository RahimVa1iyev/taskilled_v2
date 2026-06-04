import { useState } from 'react'
import { Check, ChevronDown, Globe, Sparkles } from 'lucide-react'

import { cn } from '@/shared/utils/cn'
import { LogoPill } from '@/modules/auth/components/LogoPill'

const FEATURES = [
  { t: 'Structured programs', s: 'Phase-based learning with clear goals' },
  { t: 'Mentor feedback', s: 'Real guidance on every task you submit' },
  { t: 'Verified certificate', s: 'Shareable proof of your completed work' },
  { t: 'Portfolio builder', s: 'Showcase your work to future employers' },
] as const

const LANGS = ['AZ', 'EN', 'RU'] as const



export function AuthLeftPanel(): React.JSX.Element {
  const [selectedLang, setSelectedLang] = useState<(typeof LANGS)[number]>('EN')
  const [open, setOpen] = useState(false)

  return (
    <div className="relative hidden min-h-dvh flex-col justify-between bg-auth-panel px-10 py-12 lg:flex lg:w-[42%]">
      <div className="absolute right-6 top-6">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="relative flex items-center gap-1 rounded-lg bg-auth-panel-surface px-3 py-1.5"
          aria-expanded={open}
          aria-controls="auth-lang-menu"
        >
          <Globe className="h-3 w-3 text-auth-panel-muted" />
          <span className="text-[11px] font-medium text-auth-panel-text">
            {selectedLang}
          </span>
          <ChevronDown className="h-3 w-3 text-auth-panel-muted" />
        </button>

        {open ? (
          <div
            id="auth-lang-menu"
            className="absolute right-0 top-full z-10 mt-1 min-w-[70px] rounded-xl border border-auth-panel-border bg-auth-panel-surface p-1"
            role="menu"
          >
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => {
                  setSelectedLang(l)
                  setOpen(false)
                }}
                role="menuitem"
                className={cn(
                  'w-full rounded-lg px-3 py-2 text-left text-[11px] hover:bg-auth-panel hover:text-white',
                  selectedLang === l
                    ? 'font-semibold text-white'
                    : 'text-auth-panel-text'
                )}
              >
                {l}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div>
        <div className="mb-6 inline-flex items-center gap-3 rounded-2xl bg-auth-panel-surface px-4 py-3">
            <LogoPill size="md" />
            <span className="inline-flex items-center gap-2 rounded-full bg-auth-panel px-3 py-1.5 text-[11px] font-semibold text-auth-accent">
              <Sparkles className="h-3.5 w-3.5" />
              Learn in Practice
            </span>
          </div>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-white">
          Your first real experience starts here
        </h2>
        <p className="mt-2 max-w-[280px] text-sm leading-relaxed text-auth-panel-muted">
          A platform connecting students with structured internship programs
        </p>

        <div className="mt-8 flex flex-col gap-5">
          {FEATURES.map((f) => (
            <div key={f.t} className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-auth-accent">
                <Check className="h-4 w-4 text-auth-ink" strokeWidth={3} />
              </div>
              <div>
                <div className="text-[14px] font-semibold text-white">
                  {f.t}
                </div>
                <div className="mt-[2px] text-[11px] text-auth-panel-muted">
                  {f.s}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto border-t border-auth-panel-surface pt-4 text-[10px] text-auth-panel-border">
        taskilled.com · Beta
      </div>
    </div>
  )
}

