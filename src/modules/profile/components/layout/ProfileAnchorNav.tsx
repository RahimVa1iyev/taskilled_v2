import { useState, useEffect, useRef, useCallback } from 'react'


// ─── Anchor nav sections ──────────────────────────────────────────────────────

const ANCHORS = [
  { id: 'personal-info', label: 'Personal info' },
  { id: 'skills',        label: 'Skills & Dillər' },
  { id: 'education',     label: 'Təhsil' },
  { id: 'experience',    label: 'İş Təcrübəsi' },
  { id: 'taskilled',     label: 'Taskilled' },
  { id: 'links',         label: 'Links' },
] as const

type AnchorId = (typeof ANCHORS)[number]['id']

// ─── ProfileAnchorNav ─────────────────────────────────────────────────────────

export function ProfileAnchorNav(): React.JSX.Element {
  const [activeId, setActiveId] = useState<AnchorId>('personal-info')
  const observerRef = useRef<IntersectionObserver | null>(null)

  // IntersectionObserver — track which section is in viewport
  useEffect(() => {
    const sections = ANCHORS.map(({ id }) => document.getElementById(id)).filter(Boolean) as HTMLElement[]

    if (sections.length === 0) return

    observerRef.current?.disconnect()

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Pick the topmost visible section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) {
          setActiveId(visible[0].target.id as AnchorId)
        }
      },
      {
        rootMargin: '-10% 0px -60% 0px',
        threshold: 0,
      },
    )

    sections.forEach((el) => observerRef.current!.observe(el))

    return () => observerRef.current?.disconnect()
  }, [])

  const handleClick = useCallback((id: AnchorId) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveId(id)
  }, [])

  return (
    <div
      className="sticky top-[147px] z-10"
      style={{ borderBottom: '1px solid var(--color-card-border)', backgroundColor: 'var(--color-content-bg)' }}
    >
      <div className="mx-auto max-w-2xl overflow-x-auto px-6 md:px-0">
        <div className="flex items-center gap-1.5 py-2.5 min-w-max">
          {ANCHORS.map(({ id, label }) => {
            const isActive = activeId === id
            return (
              <button
                key={id}
                onClick={() => handleClick(id)}
                className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150"
                style={
                  isActive
                    ? { backgroundColor: 'var(--color-anchor-active-bg)', color: 'var(--color-anchor-active-fg)' }
                    : { border: '1px solid var(--color-card-border)', color: 'var(--color-text-muted)' }
                }
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
