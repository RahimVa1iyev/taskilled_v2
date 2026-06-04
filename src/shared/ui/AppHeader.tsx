import { useState, useRef, useEffect } from 'react'
import { useNavigate, type NavigateFunction } from 'react-router-dom'
import {
  ChevronDown, User, LogOut, Menu, X
} from 'lucide-react'
import { useIsAuthenticated, useUser } from '@/modules/auth'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { ROUTES } from '@/shared/constants/routes'
import { useScrollToSection } from '@/shared/hooks/useScrollToSection'
import { LanguageSwitcher } from '@/shared/ui/custom/LanguageSwitcher'
import { cn } from '@/shared/utils/cn'
import type { MeResponse } from '@/modules/auth'
import { AppLogo } from '@/shared/ui/custom/AppLogo'

const NAV_ITEMS = [
  { label: 'Taskilled nədir', sectionId: 'about' },
  { label: 'Necə işləyir', sectionId: 'how-it-works' },
  { label: 'Proqramlar', sectionId: 'programs' },
  { label: 'Qiymətlər', sectionId: 'pricing' },
] as const

export function AppHeader(): React.JSX.Element {
  const isAuthenticated = useIsAuthenticated()
  const user = useUser()
  const clearAuth = useAuthStore(s => s.clearAuth)
  const navigate = useNavigate()
  const { scrollTo } = useScrollToSection()
  const [mobileOpen, setMobileOpen] = useState(false)



  function handleLogout() {
    clearAuth()
    navigate(ROUTES.ROOT)
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50"
      style={{ padding: '1rem 1.5rem' }}
    >
      <header
        className="max-w-7xl mx-auto"
        style={{
          backgroundColor: '#0F172A',
          borderRadius: '1rem',
          padding: '0 2rem',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px solid #1E293B',
        }}
      >

        {/* Logo */}
        <AppLogo href={ROUTES.ROOT} variant="dark" size="md" />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.sectionId}
              type="button"
              onClick={() => scrollTo(item.sectionId)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              style={{ color: 'var(--color-dark-muted)' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-dark-muted)'}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher variant="dark" />

          {!isAuthenticated ? (
            <GuestActions navigate={navigate} />
          ) : (
            <UserMenu user={user} onLogout={handleLogout} navigate={navigate} />
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-xl text-[var(--color-dark-muted)] hover:text-white"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Menyu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div
          className="md:hidden border-t px-4 py-3 flex flex-col gap-1"
          style={{
            backgroundColor: 'var(--color-dark-surface)',
            borderColor: 'var(--color-dark-border)'
          }}
        >
          {NAV_ITEMS.map(item => (
            <button
              key={item.sectionId}
              type="button"
              onClick={() => { scrollTo(item.sectionId); setMobileOpen(false) }}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium
                         text-[var(--color-dark-muted)] hover:text-white
                         hover:bg-white/5 transition-colors"
            >
              {item.label}
            </button>
          ))}

          {!isAuthenticated && (
            <div className="flex flex-col gap-2 pt-3 mt-2
                            border-t border-[var(--color-dark-border)]">
              <button
                onClick={() => { navigate(ROUTES.AUTH.LOGIN); setMobileOpen(false) }}
                className="w-full py-2.5 rounded-xl text-sm font-medium
                           text-[var(--color-dark-muted)] hover:text-white
                           border border-[var(--color-dark-border)]
                           hover:bg-white/5 transition-colors"
              >
                Giriş
              </button>
              <button
                onClick={() => { navigate(ROUTES.AUTH.REGISTER); setMobileOpen(false) }}
                className="w-full py-2.5 rounded-xl text-sm font-bold
                           text-[var(--color-ink)]"
                style={{ backgroundColor: 'var(--color-brand)' }}
              >
                Qeydiyyat
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}


// Guest buttons
function GuestActions({ navigate }: { navigate: NavigateFunction }) {
  return (
    <div className="hidden md:flex items-center gap-2">
      <button
        onClick={() => navigate(ROUTES.AUTH.LOGIN)}
        className="px-4 py-2 text-sm font-medium rounded-xl transition-colors"
        style={{ color: 'var(--color-dark-muted)' }}
        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--color-dark-muted)'}
      >
        Giriş
      </button>
      <button
        onClick={() => navigate(ROUTES.AUTH.REGISTER)}
        className="px-4 py-2 text-sm font-bold rounded-xl transition-colors"
        style={{
          backgroundColor: 'var(--color-brand)',
          color: 'var(--color-ink)'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = 'var(--color-brand-hover)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = 'var(--color-brand)'
        }}
      >
        Qeydiyyat
      </button>
    </div>
  )
}

// User menu dropdown
function UserMenu({
  user,
  onLogout,
  navigate,
}: {
  user: MeResponse | null
  onLogout: () => void
  navigate: NavigateFunction
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()
  const initials = getInitials(user?.firstName, user?.lastName)

  return (
    <div ref={ref} className="relative hidden md:block">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl
                   hover:bg-white/5 transition-colors"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center
                        justify-center text-xs font-bold flex-shrink-0"
          style={{
            backgroundColor: 'var(--color-dark-surface)',
            border: '1px solid var(--color-dark-border)',
            color: 'var(--color-dark-muted)'
          }}
        >
          {user?.imgUrl ? (
            <img src={user.imgUrl} alt={fullName}
              className="w-full h-full object-cover" />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        {/* Name */}
        {fullName && (
          <span className="text-sm font-medium text-white max-w-[120px] truncate">
            {fullName}
          </span>
        )}
        <ChevronDown
          size={14}
          className={cn(
            'transition-transform text-[var(--color-dark-muted)]',
            open && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-48 rounded-xl
                     overflow-hidden z-50 py-1"
          style={{
            backgroundColor: 'var(--color-dark-surface)',
            border: '1px solid var(--color-dark-border)'
          }}
        >
          <button
            type="button"
            onClick={() => { navigate(ROUTES.APP.PROFILE); setOpen(false) }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm
                       text-[var(--color-dark-muted)] hover:text-white
                       hover:bg-white/5 transition-colors"
          >
            <User size={15} />
            Profilim
          </button>

          <div style={{
            borderTop: '1px solid var(--color-dark-border)',
            margin: '4px 0'
          }} />

          <button
            type="button"
            onClick={() => { onLogout(); setOpen(false) }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm
                       hover:bg-white/5 transition-colors text-red-400"
          >
            <LogOut size={15} />
            Çıxış
          </button>
        </div>
      )}
    </div>
  )
}

// getInitials helper (same as existing Header.tsx)
function getInitials(firstName?: string | null, lastName?: string | null): string {
  const a = (firstName?.trim().at(0) ?? '').toUpperCase()
  const b = (lastName?.trim().at(0) ?? '').toUpperCase()
  return (a + b) || 'U'
}
