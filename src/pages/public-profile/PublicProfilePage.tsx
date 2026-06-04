import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin, Globe, AtSign, Video,
  GraduationCap, Briefcase, Code2, Award,
  Copy, Check, FileDown
} from 'lucide-react'
import { useState } from 'react'

import { useUser } from '@/modules/auth'
import { LINK_TYPES } from '@/modules/profile/constants/link-types'
import type { LinkResponse } from '@/modules/profile/types/profile.types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getUsernameSlug(firstName?: string | null, lastName?: string | null): string {
  const first = (firstName ?? '').toLowerCase().replace(/\s+/g, '')
  const last = (lastName ?? '').toLowerCase().replace(/\s+/g, '')
  return [first, last].filter(Boolean).join('-') || 'profile'
}

function getLinkIcon(linkType: string | null) {
  switch (linkType) {
    case LINK_TYPES.LINKEDIN:  return <AtSign size={16} />
    case LINK_TYPES.GITHUB:    return <Globe size={16} />
    case LINK_TYPES.YOUTUBE:   return <Video size={16} />
    case LINK_TYPES.FACEBOOK:  return <Globe size={16} />
    case LINK_TYPES.INSTAGRAM: return <AtSign size={16} />
    default:                   return <Globe size={16} />
  }
}

type Tab = 'overview' | 'experience' | 'education' | 'skills'

// ─── PublicProfilePage ────────────────────────────────────────────────────────

export function PublicProfilePage(): React.JSX.Element {
  const { username } = useParams<{ username: string }>()
  const currentUser = useUser()
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [copied, setCopied] = useState(false)

  // For now: match current user by slug, otherwise 404
  const currentSlug = getUsernameSlug(currentUser?.firstName, currentUser?.lastName)
  const isOwner = username === currentSlug
  const profile = isOwner ? currentUser : null

  function handleCopyUrl() {
    void navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[--color-content-bg]">
        <div className="text-6xl">😕</div>
        <h1 className="text-xl font-bold text-[--color-sidebar-text]">Profil tapılmadı</h1>
        <p className="text-sm text-[--color-text-muted]">
          @{username} istifadəçisi mövcud deyil
        </p>
      </div>
    )
  }

  const displayName = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'İstifadəçi'
  const initials = [profile.firstName?.[0], profile.lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?'
  const links = (profile as { links?: LinkResponse[] }).links ?? []
  const publicUrl = `taskilled.com/u/${username}`

  const TABS: { id: Tab; label: string }[] = [
    { id: 'overview',   label: 'Xülasə' },
    { id: 'experience', label: 'Təcrübə' },
    { id: 'education',  label: 'Təhsil' },
    { id: 'skills',     label: 'Bacarıqlar' },
  ]

  return (
    <div className="min-h-screen bg-[--color-content-bg]">
      {/* Dark header */}
      <div className="bg-[--color-dark] px-6 py-8 md:px-12">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-6"
          >
            {/* Avatar */}
            {profile.imgUrl ? (
              <img
                src={profile.imgUrl}
                alt={displayName}
                className="h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-[--color-brand] ring-offset-2 ring-offset-[--color-dark]"
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[--color-brand] text-2xl font-black text-[--color-brand-on] ring-2 ring-[--color-brand] ring-offset-2 ring-offset-[--color-dark]">
                {initials}
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-white">{displayName}</h1>
              <p className="text-sm text-[--color-dark-muted]">Intern · Taskilled</p>

              {/* Meta */}
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[--color-dark-muted]">
                {profile.city && (
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {profile.city.name}
                    {profile.country && `, ${profile.country.name}`}
                  </span>
                )}
                {profile.webSite && (
                  <a
                    href={profile.webSite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-white"
                  >
                    <Globe size={12} /> {profile.webSite.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className="mt-3 text-sm text-[--color-dark-muted] leading-relaxed">{profile.bio}</p>
              )}

              {/* Social links */}
              {links.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center h-8 w-8 rounded-lg bg-[--color-dark-surface] text-[--color-dark-muted] transition-colors hover:bg-[--color-dark-border] hover:text-white"
                    >
                      {getLinkIcon(link.linkType)}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="border-b border-[--color-border-soft] bg-[--color-card-bg] px-6 md:px-12">
        <div className="mx-auto max-w-3xl flex gap-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-[--color-brand] text-[--color-sidebar-text]'
                  : 'border-transparent text-[--color-text-muted] hover:text-[--color-sidebar-text]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="mx-auto max-w-3xl px-6 py-6 md:px-0">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Certificates */}
              {(profile.certificates ?? []).length > 0 && (
                <div className="rounded-xl border border-[--color-border-soft] bg-[--color-card-bg] p-5">
                  <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[--color-sidebar-text]">
                    <Award size={16} className="text-[--color-brand-text]" /> Sertifikatlar
                  </h2>
                  <div className="space-y-2">
                    {(profile.certificates ?? []).map((cert) => (
                      <div key={cert.id} className="flex items-center gap-3 rounded-xl border border-[--color-pub-box-border] bg-[--color-pub-box-bg] p-3">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[--color-sidebar-text]">{cert.name}</p>
                          <p className="text-xs text-[--color-text-muted]">{cert.issuer ?? 'Taskilled'}</p>
                        </div>
                        <span className="rounded-full bg-white border border-[--color-pub-box-border] px-2.5 py-0.5 text-[10px] font-semibold text-[--color-pub-box-fg]">
                          ✓ Doğrulandı
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills preview */}
              {(profile.skills ?? []).length > 0 && (
                <div className="rounded-xl border border-[--color-border-soft] bg-[--color-card-bg] p-5">
                  <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[--color-sidebar-text]">
                    <Code2 size={16} className="text-[--color-brand-text]" /> Bacarıqlar
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {(profile.skills ?? []).map((skill) => (
                      <div key={skill.id} className="flex items-center gap-1.5 rounded-full bg-[--color-chip-bg] px-3 py-1">
                        <span className="text-xs font-medium text-[--color-chip-fg]">{skill.name}</span>
                        {skill.level && (
                          <span className="text-[10px] text-[--color-chip-fg] opacity-70">{skill.level}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Experience */}
          {activeTab === 'experience' && (
            <div className="rounded-xl border border-[--color-border-soft] bg-[--color-card-bg] p-5">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[--color-sidebar-text]">
                <Briefcase size={16} className="text-[--color-brand-text]" /> İş Təcrübəsi
              </h2>
              {(profile.experiences ?? []).length === 0 ? (
                <p className="text-xs text-[--color-text-placeholder] italic">Təcrübə məlumatı yoxdur</p>
              ) : (
                <div className="space-y-4">
                  {(profile.experiences ?? []).map((exp) => (
                    <div key={exp.id} className="flex gap-4">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[--color-ghost-bg]">
                        <Briefcase size={14} className="text-[--color-brand-text]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[--color-sidebar-text]">{exp.position}</p>
                        <p className="text-xs font-medium text-[--color-brand-text]">{exp.company}</p>
                        <p className="text-[11px] text-[--color-text-muted]">{exp.startDate} → {exp.endDate ?? 'İndi'}</p>
                        {exp.description && <p className="mt-1 text-xs text-[--color-text-muted]">{exp.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Education */}
          {activeTab === 'education' && (
            <div className="rounded-xl border border-[--color-border-soft] bg-[--color-card-bg] p-5">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[--color-sidebar-text]">
                <GraduationCap size={16} className="text-[--color-brand-text]" /> Təhsil
              </h2>
              {(profile.educations ?? []).length === 0 ? (
                <p className="text-xs text-[--color-text-placeholder] italic">Təhsil məlumatı yoxdur</p>
              ) : (
                <div className="space-y-4">
                  {(profile.educations ?? []).map((edu) => (
                    <div key={edu.id} className="flex gap-4">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[--color-ghost-bg]">
                        <GraduationCap size={14} className="text-[--color-brand-text]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[--color-sidebar-text]">{edu.schoolName}</p>
                        <p className="text-xs text-[--color-text-muted]">
                          {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(' — ')}
                        </p>
                        {(edu.startDate || edu.endDate) && (
                          <p className="text-[11px] text-[--color-text-placeholder]">
                            {edu.startDate ?? '?'} → {edu.endDate ?? 'İndi'}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Skills */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[--color-border-soft] bg-[--color-card-bg] p-5">
                <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[--color-sidebar-text]">
                  <Code2 size={16} className="text-[--color-brand-text]" /> Bacarıqlar
                </h2>
                {(profile.skills ?? []).length === 0 ? (
                  <p className="text-xs text-[--color-text-placeholder] italic">Bacarıq məlumatı yoxdur</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {(profile.skills ?? []).map((skill) => (
                      <div key={skill.id} className="flex items-center gap-1.5 rounded-full bg-[--color-chip-bg] px-3 py-1.5">
                        <span className="text-xs font-medium text-[--color-chip-fg]">{skill.name}</span>
                        {skill.level && <span className="text-[10px] text-[--color-chip-fg] opacity-70">{skill.level}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Languages */}
              {(profile.languages ?? []).length > 0 && (
                <div className="rounded-xl border border-[--color-border-soft] bg-[--color-card-bg] p-5">
                  <h2 className="mb-3 text-sm font-semibold text-[--color-sidebar-text]">Dillər</h2>
                  <div className="flex flex-wrap gap-2">
                    {(profile.languages ?? []).map((lang) => (
                      <div key={lang.id} className="flex items-center gap-1.5 rounded-full bg-[--color-chip-bg] px-3 py-1.5">
                        <span className="text-xs font-medium text-[--color-chip-fg]">{lang.language}</span>
                        <span className="text-[10px] text-[--color-chip-fg] opacity-70">{lang.languageLevel}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Footer bar */}
      <div className="sticky bottom-0 border-t border-[--color-border-soft] bg-[--color-card-bg] px-6 py-3">
        <div className="mx-auto max-w-3xl flex items-center justify-between gap-4">
          <p className="text-xs text-[--color-text-muted]">{publicUrl}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyUrl}
              className="flex items-center gap-1.5 rounded-lg border border-[--color-ghost-border] bg-[--color-ghost-bg] px-3 py-1.5 text-xs font-medium text-[--color-ghost-fg] transition-colors hover:bg-[--color-border-soft]"
            >
              {copied ? <><Check size={12} /> Kopyalandı</> : <><Copy size={12} /> URL kopyala</>}
            </button>
            <button
              disabled
              title="PDF yükləmə tezliklə"
              className="flex items-center gap-1.5 rounded-lg border border-[--color-ghost-border] bg-[--color-ghost-bg] px-3 py-1.5 text-xs font-medium text-[--color-ghost-fg] opacity-40 cursor-not-allowed"
            >
              <FileDown size={12} /> PDF yüklə
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
