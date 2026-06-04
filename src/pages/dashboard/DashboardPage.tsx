import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Lock, ArrowRight, BookOpen, GraduationCap, Building2, Award, Briefcase } from 'lucide-react'

import { useUser } from '@/modules/auth'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcProfileCompletion(user: NonNullable<ReturnType<typeof useUser>>): number {
  let pct = 0
  if (user.firstName && user.city && user.bio) pct += 30
  else if (user.firstName) pct += 10
  if ((user.skills ?? []).length > 0) pct += 15
  if ((user.languages ?? []).length > 0) pct += 10
  if ((user.educations ?? []).length > 0) pct += 15
  if ((user.experiences ?? []).length > 0 || (user.certificates ?? []).length > 0) pct += 15
  return pct
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ProgressBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[--color-progress-track]">
      <motion.div
        className="h-full rounded-full bg-[--color-brand]"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
    </div>
  )
}

type StepStatus = 'done' | 'active' | 'locked'

interface OnboardingStepProps {
  step: number
  label: string
  description: string
  status: StepStatus
  href?: string
}

function OnboardingStep({ step, label, description, status, href }: OnboardingStepProps) {
  const isDone = status === 'done'
  const isActive = status === 'active'

  return (
    <div
      className={`flex items-start gap-4 rounded-xl border p-4 transition-all duration-200 ${
        isDone
          ? 'border-[--color-pub-box-border] bg-[--color-pub-box-bg]'
          : isActive
          ? 'border-[--color-brand] bg-white shadow-sm'
          : 'border-[--color-border-soft] bg-white opacity-50'
      }`}
    >
      {/* Step icon */}
      <div className="mt-0.5 shrink-0">
        {isDone ? (
          <CheckCircle2 size={20} className="text-[--color-brand-text]" />
        ) : isActive ? (
          <Circle size={20} className="text-[--color-brand]" />
        ) : (
          <Lock size={20} className="text-[--color-text-muted]" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p
            className={`text-sm font-semibold ${
              isDone ? 'text-[--color-brand-text]' : 'text-[--color-sidebar-text]'
            }`}
          >
            <span className="mr-1.5 text-xs text-[--color-text-muted] font-normal">0{step}</span>
            {label}
          </p>
          {isActive && href && (
            <a
              href={href}
              className="flex shrink-0 items-center gap-1 rounded-lg bg-[--color-brand] px-2.5 py-1 text-xs font-semibold text-[--color-brand-on] transition-colors hover:bg-[--color-brand-hover]"
            >
              Başla <ArrowRight size={12} />
            </a>
          )}
        </div>
        <p className="mt-0.5 text-xs text-[--color-text-muted]">{description}</p>
      </div>
    </div>
  )
}

const MOCK_PROGRAMS = [
  {
    id: 1,
    title: 'UI/UX Design Internship',
    company: 'Kapital Bank',
    category: 'Design',
    duration: '4 həftə',
    type: 'Pulsuz',
    spots: 8,
  },
  {
    id: 2,
    title: 'Digital Marketing Program',
    company: 'Azərenerji',
    category: 'Marketing',
    duration: '6 həftə',
    type: 'Pulsuz',
    spots: 12,
  },
  {
    id: 3,
    title: 'Data Analysis Internship',
    company: 'PASHA Bank',
    category: 'Data',
    duration: '5 həftə',
    type: 'Pullu',
    spots: 5,
  },
]

function ProgramsPlaceholder() {
  return (
    <div>
      {/* Platform statistikası — canlılıq üçün */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Aktiv proqram', value: '24', icon: <Briefcase size={16}/> },
          { label: 'Şirkət partner', value: '12', icon: <Building2 size={16}/> },
          { label: 'Verilən sertifikat', value: '180+', icon: <Award size={16}/> },
        ].map((stat) => (
          <div key={stat.label}
            className="rounded-xl p-4 flex flex-col gap-2"
            style={{ backgroundColor: 'var(--color-card-bg)', border: '0.5px solid var(--color-card-border)' }}>
            <span style={{ color: 'var(--color-brand-text)' }}>{stat.icon}</span>
            <p className="text-2xl font-bold" style={{ color: '#0E172A' }}>{stat.value}</p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[--color-border-soft] bg-[--color-card-bg] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[--color-sidebar-text]">Tövsiyə olunan proqramlar</h3>
        </div>
        <div className="space-y-3">
          {MOCK_PROGRAMS.map((p) => (
            <div key={p.id}
              className="flex items-center justify-between rounded-xl px-4 py-3.5"
              style={{ backgroundColor: 'var(--color-card-bg)', border: '0.5px solid var(--color-card-border)' }}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold"
                  style={{ backgroundColor: '#0E172A', color: 'var(--color-brand)' }}>
                  {p.company.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#0E172A' }}>{p.title}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {p.company} · {p.duration} · {p.spots} yer qalıb
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full px-2.5 py-1 text-xs font-medium"
                  style={{ backgroundColor: 'var(--color-chip-bg)', color: 'var(--color-chip-fg)' }}>
                  {p.category}
                </span>
                <span className="rounded-full px-2.5 py-1 text-xs font-medium"
                  style={{ backgroundColor: p.type === 'Pulsuz' ? '#DCFCE7' : '#FEF3C7',
                           color: p.type === 'Pulsuz' ? '#166534' : '#854F0B' }}>
                  {p.type}
                </span>
              </div>
            </div>
          ))}
          <p className="text-center text-xs py-2" style={{ color: 'var(--color-text-muted)' }}>
            Proqramlar tezliklə əlavə olunacaq — bu nümunə datadır
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── State A — New user ───────────────────────────────────────────────────────

function DashboardStateA({ user }: { user: NonNullable<ReturnType<typeof useUser>> }) {
  const completion = calcProfileCompletion(user)
  const firstName = user.firstName ?? 'İstifadəçi'

  const profileStep: StepStatus = completion >= 30 ? 'done' : 'active'
  const programStep: StepStatus = completion >= 85 ? 'active' : 'locked'

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-[--color-sidebar-text]">
          Xoş gəldin, {firstName}! 👋
        </h1>
        <p className="mt-1 text-sm text-[--color-text-muted]">İlk addımlarını at</p>
      </div>

      {/* Onboarding card */}
      <div className="rounded-xl border border-[--color-border-soft] bg-[--color-card-bg] p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[--color-sidebar-text]">Onboarding</h2>
            <p className="text-xs text-[--color-text-muted]">Profil tamamlama — {completion}%</p>
          </div>
          <span className="rounded-full bg-[--color-chip-bg] px-3 py-1 text-xs font-bold text-[--color-chip-fg]">
            {completion}%
          </span>
        </div>

        <ProgressBar value={completion} />

        <div className="mt-4 flex flex-col gap-3">
          <OnboardingStep
            step={1}
            label="Qeydiyyat"
            description="Hesab uğurla yaradıldı"
            status="done"
          />
          <OnboardingStep
            step={2}
            label="Profilini tamamla"
            description="Şəhər, bio, bacarıqlar və təhsil əlavə et"
            status={profileStep}
            href="/profile"
          />
          <OnboardingStep
            step={3}
            label="Proqram tap və müraciət et"
            description="Sənə uyğun bir internship proqramı seç"
            status={programStep}
          />
        </div>
      </div>

      {/* Programs placeholder */}
      <ProgramsPlaceholder />
    </div>
  )
}

// ─── State C — Completed programs ─────────────────────────────────────────────

function DashboardStateC({ user }: { user: NonNullable<ReturnType<typeof useUser>> }) {
  const firstName = user.firstName ?? 'İstifadəçi'
  const certs = user.certificates ?? []

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[--color-sidebar-text]">
          Təbriklər, {firstName}! 🎓
        </h1>
        <p className="mt-1 text-sm text-[--color-text-muted]">
          {certs.length} proqram tamamladın
        </p>
      </div>

      <div className="rounded-xl border border-[--color-border-soft] bg-[--color-card-bg] p-5">
        <h2 className="mb-4 text-sm font-semibold text-[--color-sidebar-text]">Sertifikatlarım</h2>
        <div className="space-y-3">
          {certs.map((cert) => (
            <div
              key={cert.id}
              className="flex items-center gap-4 rounded-xl border border-[--color-border-soft] p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[--color-pub-box-bg]">
                <GraduationCap size={20} className="text-[--color-pub-box-fg]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[--color-sidebar-text] truncate">{cert.name}</p>
                <p className="text-xs text-[--color-text-muted]">
                  {cert.issuer ?? 'Taskilled'}{cert.issuedDate ? ` · ${cert.issuedDate}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[--color-pub-box-bg] px-2.5 py-0.5 text-[10px] font-semibold text-[--color-pub-box-fg] border border-[--color-pub-box-border]">
                  Doğrulandı ✓
                </span>
                {cert.certificateUrl && (
                  <a
                    href={cert.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-[--color-ghost-border] bg-[--color-ghost-bg] px-2.5 py-1 text-xs font-medium text-[--color-ghost-fg] transition-colors hover:bg-[--color-border-soft]"
                  >
                    PDF
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProgramsPlaceholder />
    </div>
  )
}

// ─── DashboardPage ────────────────────────────────────────────────────────────

export function DashboardPage(): React.JSX.Element {
  const user = useUser()

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {!user ? (
          // Loading skeleton
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="space-y-2">
              <div className="h-8 w-56 rounded-lg bg-[--color-surface-muted] animate-pulse" />
              <div className="h-4 w-36 rounded bg-[--color-surface-muted] animate-pulse" />
            </div>
            <div className="h-64 rounded-xl bg-[--color-surface-muted] animate-pulse" />
          </div>
        ) : (user.certificates ?? []).length > 0 &&
          (user.requiredFields ?? []).length === 0 ? (
          // State C — completed programs
          <DashboardStateC user={user} />
        ) : (
          // State A — new / incomplete user (B will be added when enrollment API is ready)
          <DashboardStateA user={user} />
        )}
      </motion.div>

      {/* Contextual tip — visible when profile is incomplete */}
      {user && (user.requiredFields ?? []).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mx-auto mt-6 max-w-3xl rounded-xl border border-[--color-pub-box-border] bg-[--color-pub-box-bg] p-4 flex items-start gap-3"
        >
          <BookOpen size={16} className="mt-0.5 shrink-0 text-[--color-pub-box-fg]" />
          <p className="text-xs text-[--color-pub-box-fg]">
            <span className="font-semibold">Profil tamamlanmayıb.</span>{' '}
            Proqramlara müraciət etmək üçün{' '}
            <a href="/profile" className="underline font-semibold">profilini tamamla →</a>
          </p>
        </motion.div>
      )}
    </div>
  )
}
