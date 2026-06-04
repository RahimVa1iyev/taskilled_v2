import { useEffect, useState } from 'react'
import { Palette } from 'lucide-react'

const THEMES = [
  { id: 'light', name: 'Light', color: '#F5F5EF' },
  { id: 'dark', name: 'Dark', color: '#0F172A' },
  { id: 'ocean', name: 'Ocean', color: '#E0F2FE' },
  { id: 'nature', name: 'Nature', color: '#EAECE2' },
]

export function ThemeSwitcher({ collapsed }: { collapsed?: boolean }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('taskilled:theme') || 'light'
  })
  
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.setAttribute('data-theme', theme)
    }
    localStorage.setItem('taskilled:theme', theme)
  }, [theme])

  return (
    <div className="relative mt-auto pt-4 flex flex-col gap-2">
      {collapsed ? (
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
          style={{ color: 'var(--color-sidebar-text)' }}
          title="Theme Switcher"
        >
          <Palette size={18} />
        </button>
      ) : (
        <div className="px-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-sidebar-text-muted)' }}>
            Theme
          </p>
          <div className="flex flex-wrap gap-2">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`relative h-6 w-6 rounded-full border-2 overflow-hidden transition-transform hover:scale-110 ${theme === t.id ? 'scale-110 border-current ring-2 ring-offset-2' : 'border-transparent'}`}
                style={{ 
                  backgroundColor: t.color, 
                  color: 'var(--color-brand)',
                }}
                title={t.name}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Popover for collapsed mode */}
      {collapsed && isOpen && (
        <div 
          className="absolute left-full bottom-0 ml-2 p-2 rounded-xl shadow-lg border z-50 flex gap-2"
          style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-card-border)' }}
        >
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTheme(t.id); setIsOpen(false); }}
              className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${theme === t.id ? 'scale-110 border-current ring-2 ring-offset-1' : 'border-transparent'}`}
              style={{ 
                backgroundColor: t.color,
                color: 'var(--color-brand)'
              }}
              title={t.name}
            />
          ))}
        </div>
      )}
    </div>
  )
}
