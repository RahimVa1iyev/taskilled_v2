
import {
  Briefcase, Send, Camera, MessageCircle,
  MonitorPlay, MapPin, Mail, type LucideIcon
} from 'lucide-react'
import { ROUTES } from '@/shared/constants/routes'
import { useScrollToSection } from '@/shared/hooks/useScrollToSection'
import { LanguageSwitcher } from '@/shared/ui/custom/LanguageSwitcher'
import { AppLogo } from '@/shared/ui/custom/AppLogo'

const FOOTER_PLATFORM_LINKS = [
  { label: 'Taskilled nədir', sectionId: 'about' },
  { label: 'Necə işləyir',    sectionId: 'how-it-works' },
  { label: 'Proqramlar',      sectionId: 'programs' },
  { label: 'Qiymətlər',       sectionId: 'pricing' },
] as const

const FOOTER_COMPANY_LINKS = [
  { label: 'Haqqımızda',   sectionId: 'about' },
  { label: 'Partnyorlar',  sectionId: 'partners' },
  { label: 'FAQ',          sectionId: 'faq' },
] as const

const SOCIAL_LINKS = [
  { icon: Briefcase,     label: 'LinkedIn',   href: '#' },
  { icon: Send,          label: 'Telegram',   href: '#' },
  { icon: Camera,        label: 'Instagram',  href: '#' },
  { icon: MessageCircle, label: 'Facebook',   href: '#' },
  { icon: MonitorPlay,   label: 'YouTube',    href: '#' },
  { icon: MapPin,        label: 'Ünvanımız',  href: '#' },
] as const

export function AppFooter(): React.JSX.Element {
  const { scrollTo } = useScrollToSection()

  return (
    <div style={{padding: '2rem 1.5rem 0' }}>
      <footer
        className="max-w-7xl mx-auto rounded-3xl px-10 py-12"
        style={{ backgroundColor: 'var(--color-dark)' }}
      >
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

          {/* Col 1: Logo + socials */}
          <div className="flex flex-col gap-5">
            <AppLogo href={ROUTES.ROOT} variant="dark" size="md" />
            <div className="flex items-center flex-wrap gap-1">
              {SOCIAL_LINKS.map(s => (
                <FooterSocialBtn key={s.label} icon={s.icon} label={s.label} />
              ))}
            </div>
          </div>

          {/* Col 2: Platform */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-4"
               style={{ color: 'var(--color-dark-muted)' }}>
              Platform
            </p>
            <div className="flex flex-col gap-2">
              {FOOTER_PLATFORM_LINKS.map(link => (
                <FooterNavBtn
                  key={link.sectionId}
                  label={link.label}
                  onClick={() => scrollTo(link.sectionId)}
                />
              ))}
            </div>
          </div>

          {/* Col 3: Şirkət */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-4"
               style={{ color: 'var(--color-dark-muted)' }}>
              Şirkət
            </p>
            <div className="flex flex-col gap-2">
              {FOOTER_COMPANY_LINKS.map(link => (
                <FooterNavBtn
                  key={link.sectionId}
                  label={link.label}
                  onClick={() => scrollTo(link.sectionId)}
                />
              ))}
            </div>
          </div>

          {/* Col 4: Əlaqə */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-4"
               style={{ color: 'var(--color-dark-muted)' }}>
              Əlaqə
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:info@taskilled.com"
                className="flex items-center gap-2 text-sm transition-colors"
                style={{ color: 'var(--color-dark-muted)' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-dark-muted)'}
              >
                <Mail size={14} />
                info@taskilled.com
              </a>
              <div className="mt-2">
                <LanguageSwitcher variant="dark" />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid var(--color-dark-border)', margin: '0 0 1.5rem' }} />

        {/* Bottom row */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <span className="text-xs" style={{ color: 'var(--color-dark-muted)' }}>
            © {new Date().getFullYear()} Taskilled. Bütün hüquqlar qorunur.
          </span>
          <div className="flex items-center gap-5">
            <FooterTextBtn label="Şərtlər və Qaydalar" />
            <FooterTextBtn label="Məxfilik Siyasəti" />
          </div>
        </div>
      </footer>

      {/* Spacer below footer */}
      <div style={{ height: '2rem' }} />
    </div>
  )
}


function FooterSocialBtn({
  icon: Icon,
  label
}: {
  icon: LucideIcon
  label: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
      style={{ color: 'var(--color-dark-muted)' }}
      onMouseEnter={e => {
        e.currentTarget.style.color = '#fff'
        e.currentTarget.style.backgroundColor = 'var(--color-dark-surface)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = 'var(--color-dark-muted)'
        e.currentTarget.style.backgroundColor = 'transparent'
      }}
    >
      <Icon size={16} />
    </button>
  )
}

function FooterNavBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left text-sm transition-colors w-fit"
      style={{ color: 'var(--color-dark-muted)' }}
      onMouseEnter={e => e.currentTarget.style.color = '#fff'}
      onMouseLeave={e => e.currentTarget.style.color = 'var(--color-dark-muted)'}
    >
      {label}
    </button>
  )
}

function FooterTextBtn({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="text-xs transition-colors"
      style={{ color: 'var(--color-dark-muted)' }}
      onMouseEnter={e => e.currentTarget.style.color = '#fff'}
      onMouseLeave={e => e.currentTarget.style.color = 'var(--color-dark-muted)'}
    >
      {label}
    </button>
  )
}
