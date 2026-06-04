import { useState, useEffect, useRef } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Compass,
  Briefcase,
  User,
  GraduationCap,
  Trophy,
  Users,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'

import { ROUTES } from '@/shared/constants/routes'
import { useUser } from '@/modules/auth'
import { useProfileQuery } from '@/modules/profile/api/profile.api'
import { useLinksQuery } from '@/modules/profile/api/links.api'
import { calculateCompletion } from '@/modules/profile/hooks/useProfile'
import { ThemeSwitcher } from '@/shared/ui'
import { cn } from '@/shared/utils/cn'

// ─── Types ──────────────────────────────────────────────────────────────────

interface NavItem {
  label: string
  icon: React.ReactNode
  to: string
  disabled?: boolean
  comingSoon?: boolean
}

// ─── Constants ───────────────────────────────────────────────────────────────

const NAV_SECTIONS: { heading: string; items: NavItem[] }[] = [
  {
    heading: 'Ana',
    items: [
      { label: 'Dashboard', icon: <LayoutDashboard size={18} />, to: ROUTES.APP.DASHBOARD },
      { label: 'Explore', icon: <Compass size={18} />, to: ROUTES.APP.EXPLORE, disabled: true },
    ],
  },
  {
    heading: 'Mənim',
    items: [
      { label: 'My Programs', icon: <Briefcase size={18} />, to: ROUTES.APP.PROGRAMS },
      { label: 'Profile', icon: <User size={18} />, to: ROUTES.APP.PROFILE },
    ],
  },
  {
    heading: 'Gələcək',
    items: [
      { label: 'Courses', icon: <GraduationCap size={18} />, to: ROUTES.APP.COURSES, disabled: true, comingSoon: true },
      { label: 'Hackathons', icon: <Trophy size={18} />, to: ROUTES.APP.HACKATHONS, disabled: true, comingSoon: true },
      { label: 'Community', icon: <Users size={18} />, to: ROUTES.APP.COMMUNITY, disabled: true, comingSoon: true },
    ],
  },
]

const SIDEBAR_STORAGE_KEY = 'taskilled:sidebar:collapsed'
const SIDEBAR_EXPANDED_W = 280
const SIDEBAR_COLLAPSED_W = 56

// ─── Tooltip ─────────────────────────────────────────────────────────────────

function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  const [visible, setVisible] = useState(false)

  return (
    <div
      className="relative flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.12 }}
            className="pointer-events-none absolute left-full top-1/2 z-50 ml-2.5 -translate-y-1/2 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium text-white shadow-lg"
            style={{ backgroundColor: 'var(--color-ink)' }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Nav Item ────────────────────────────────────────────────────────────────

interface NavItemProps {
  item: NavItem
  collapsed: boolean
}

function SidebarNavItem({ item, collapsed }: NavItemProps) {
  const tooltipLabel = item.comingSoon ? 'Tezliklə' : item.label

  const inner = (
    <NavLink
      to={item.to}
      aria-disabled={item.disabled}
      tabIndex={item.disabled ? -1 : undefined}
      className={() =>
        cn(
          'group flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium transition-colors duration-150',
          item.disabled && 'pointer-events-none cursor-not-allowed opacity-40',
        )
      }
      style={({ isActive }: { isActive: boolean }) =>
        isActive && !item.disabled
          ? {
            backgroundColor: 'var(--color-nav-active-bg)',
            color: 'var(--color-nav-active-fg)',
            borderLeft: '2.5px solid var(--color-brand)',
            borderRadius: '0px 10px 10px 0px',
            paddingLeft: '10px',
            fontWeight: '600',
          }
          : {
            color: 'var(--color-sidebar-text)',
            borderLeft: '2.5px solid transparent',
            borderRadius: '0px 10px 10px 0px',
            paddingLeft: '10px',
          }
      }
    >
      <span className="shrink-0">{item.icon}</span>
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            key="label"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden whitespace-nowrap"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </NavLink>
  )

  if (collapsed || item.comingSoon) {
    return <Tooltip label={tooltipLabel}>{inner}</Tooltip>
  }

  return inner
}

// ─── ProfileRing ─────────────────────────────────────────────────────────────

function ProfileRing({
  percent,
  size,
  stroke,
  initials,
  imgUrl,
}: {
  percent: number
  size: number
  stroke: number
  initials: string
  imgUrl?: string | null
}) {
  const radius = (size - stroke) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percent / 100) * circumference

  return (
    <div className="relative flex flex-col items-center justify-center mb-3" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 -rotate-90">
        <defs>
          <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D1E728" />
            <stop offset="100%" stopColor="#A8C420" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ring-gradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div
        className="flex items-center justify-center rounded-full overflow-hidden"
        style={{
          width: size - stroke * 4,
          height: size - stroke * 4,
          background: '#EFEDE6',
        }}
      >
        {imgUrl ? (
          <img src={imgUrl} className="h-full w-full object-cover" alt="Profile" />
        ) : (
          <span className="text-[18px] font-bold" style={{ color: '#0E172A' }}>
            {initials}
          </span>
        )}
      </div>
      <div
        className="absolute -bottom-2 px-2 py-0.5 rounded-full text-[11px] font-semibold"
        style={{
          backgroundColor: '#EFEDE6',
          color: '#0E172A',
        }}
      >
        {percent}%
      </div>
    </div>
  )
}

// ─── AppLayout ───────────────────────────────────────────────────────────────

function AppSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean
  onToggle: () => void
}) {
  const user = useUser()
  const { data: profile } = useProfileQuery()
  const { data: links = [] } = useLinksQuery()

  const initials = [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?'
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Profil'

  const baseCompletion = profile ? calculateCompletion(profile) : 0
  const linksBonus = links.length > 0 ? 15 : 0
  const completion = Math.min(100, baseCompletion + linksBonus)

  function getNextHint(): string | null {
    if (!profile) return null
    if (!profile.firstName || !profile.city || !profile.bio) return 'Şəhər, bio əlavə et'
    if ((profile.skills ?? []).length === 0) return 'Skills əlavə et → +15%'
    if ((profile.languages ?? []).length === 0) return 'Dil əlavə et → +10%'
    if ((profile.educations ?? []).length === 0) return 'Təhsil əlavə et → +15%'
    if ((profile.experiences ?? []).length === 0) return 'Təcrübə əlavə et → +15%'
    if (links.length === 0) return 'Link əlavə et → +15%'
    return null
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_EXPANDED_W }}
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      className="relative flex h-screen shrink-0 flex-col overflow-hidden"
      style={{
        minWidth: collapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_EXPANDED_W,
        backgroundColor: 'var(--color-sidebar-bg)',
      }}
    >
      {/* Logo */}
      <div className={cn("flex px-3 gap-2 mb-3", collapsed ? "flex-col items-center py-3" : "h-14 items-center")}>
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: 'var(--color-brand-on)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            {/* T */}
            <line x1="4" y1="5" x2="13" y2="5" stroke="#D1E728" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="8.5" y1="5" x2="8.5" y2="19" stroke="#D1E728" strokeWidth="2.2" strokeLinecap="round" />
            {/* K */}
            <line x1="13" y1="5" x2="13" y2="19" stroke="#D1E728" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="13" y1="12" x2="19" y2="5" stroke="#D1E728" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="13" y1="12" x2="19" y2="19" stroke="#D1E728" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              className="flex flex-1 items-center justify-between overflow-hidden"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.18 }}
            >
              <span className="whitespace-nowrap text-[15px] font-black tracking-tight" style={{ color: 'var(--color-sidebar-text)' }}>
                taskilled
              </span>
              <button
                onClick={onToggle}
                aria-label="Sidebar-ı bağla"
                className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
                style={{ color: 'var(--color-text-muted)' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-ghost-bg)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <PanelLeftClose size={15} />
              </button>
            </motion.div>
          )}
          {collapsed && (
            <motion.button
              onClick={onToggle}
              aria-label="Sidebar-ı aç"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-7 w-7 mt-1 shrink-0 items-center justify-center rounded-lg transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-ghost-bg)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <PanelLeftOpen size={15} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* User card — collapsed vs expanded fərqli render */}
      {collapsed ? (
        <div className="flex justify-center py-2 px-2 mb-4 mt-2">
          {user?.imgUrl ? (
            <img src={user.imgUrl} className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold"
              style={{ backgroundColor: 'var(--color-brand)', color: 'var(--color-brand-on)' }}>
              {initials}
            </div>
          )}
        </div>
      ) : (
        <div className="mx-2 mb-4 mt-2 flex flex-col items-center justify-center"
          style={{
            backgroundColor: 'var(--color-ghost-bg)',
            borderRadius: '20px',
            padding: '20px',
          }}>

          <ProfileRing
            percent={completion}
            size={120}
            stroke={6}
            initials={initials}
            imgUrl={user?.imgUrl}
          />

          <p className="text-[14px] font-semibold mt-2" style={{ color: 'var(--color-sidebar-text)' }}>
            {displayName}
          </p>
          <p className="text-[12px] mt-0.5 text-center px-1" style={{ color: 'var(--color-sidebar-text-muted)' }}>
            {profile?.areasOfInterest || 'intern'}
          </p>

          {completion < 100 ? (
            <p className="mt-2 text-[11px] font-medium" style={{ color: 'var(--color-brand-text)' }}>
              {getNextHint()}
            </p>
          ) : (
            <div className="mt-2 flex items-center gap-1.5 rounded-full px-2 py-1">
              <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--color-brand-text)' }} />
              <span className="text-[11px] font-medium" style={{ color: 'var(--color-brand-text)' }}>Profil tam doldurulub</span>
            </div>
          )}
        </div>
      )}

      {/* Nav */}
      <nav className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden p-2 pt-2 mt-4">
        {NAV_SECTIONS.map((section, index) => (
          <div key={section.heading}>
            {index > 0 && <div className="my-2" />}
            <div className="flex flex-col gap-1">
              {section.items.map((item) => (
                <SidebarNavItem key={item.to} item={item} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Theme Switcher */}
      <div className="mb-4">
        <ThemeSwitcher collapsed={collapsed} />
      </div>

    </motion.aside>
  )
}

export function AppLayout(): React.JSX.Element {
  const storedCollapsed = localStorage.getItem(SIDEBAR_STORAGE_KEY)
  const [collapsed, setCollapsed] = useState<boolean>(storedCollapsed !== 'false')

  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return }
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(collapsed))
  }, [collapsed])

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--color-page-bg)' }}>
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((p) => !p)} />
      <main
        className="flex-1 overflow-y-auto p-3 transition-colors duration-300"
        style={{ backgroundColor: 'var(--color-page-bg)' }}
      >
        <div
          className="h-full w-full overflow-y-auto rounded-xl transition-colors duration-300"
          style={{ backgroundColor: 'var(--color-content-bg)' }}
        >
          {/* ── Global page container — all app pages share this ── */}
          <div className="mx-auto max-w-8xl px-8 py-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}

