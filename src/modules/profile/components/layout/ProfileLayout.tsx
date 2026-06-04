import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Pencil, Eye, Share, Check } from 'lucide-react'

import { useProfileQuery } from '@/modules/profile/api/profile.api'
import { PersonalInfoSection } from '@/modules/profile/components/sections/PersonalInfoSection'
import { SkillsLanguagesSection } from '@/modules/profile/components/sections/SkillsLanguagesSection'
import { EducationSection } from '@/modules/profile/components/sections/EducationSection'
import { ExperienceSection } from '@/modules/profile/components/sections/ExperienceSection'
import { TaskilledSection } from '@/modules/profile/components/sections/TaskilledSection'
import { LinksSection } from '@/modules/profile/components/sections/LinksSection'
import { CvView } from './CvView'

export function ProfileLayout(): React.JSX.Element {
  const [mode, setMode] = useState<'edit' | 'cv'>('edit')
  const { data: profile } = useProfileQuery()

  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const first = (profile?.firstName ?? '').toLowerCase().replace(/\s+/g, '')
    const last = (profile?.lastName ?? '').toLowerCase().replace(/\s+/g, '')
    const slug = [first, last].filter(Boolean).join('-') || 'profile'
    const publicUrl = `https://taskilled.com/u/${slug}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.firstName || ''} ${profile?.lastName || ''} - Taskilled Profile`,
          text: 'Check out my professional profile on Taskilled!',
          url: publicUrl,
        })
        return;
      } catch (err) {
        console.log('Native sharing cancelled or failed', err)
      }
    }

    void navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
              EDIT YOUR PROFILE
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-[--color-sidebar-text]">
              Hello, <span style={{ color: 'var(--color-brand-text)' }}>{profile?.firstName || 'User'}</span>
            </h1>
            <p className="text-sm text-[--color-text-muted]">
              Fill in the sections below — your CV updates live. Toggle to preview anytime.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="relative flex items-center gap-1 rounded-[16px] bg-[--color-card-bg] p-1.5 border border-[--color-border-soft] shadow-sm">
              <button
                onClick={() => setMode('edit')}
                className="relative z-10 flex items-center gap-2 rounded-[12px] px-4 py-2 text-[13px] font-bold transition-colors cursor-pointer"
                style={{
                  color: mode === 'edit' ? 'var(--color-card-bg)' : 'var(--color-text-muted)'
                }}
              >
                {mode === 'edit' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-[12px] shadow-md"
                    style={{ backgroundColor: 'var(--color-sidebar-text)' }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2"><Pencil size={15} /> Edit</span>
              </button>
              
              <button
                onClick={() => setMode('cv')}
                className="relative z-10 flex items-center gap-2 rounded-[12px] px-4 py-2 text-[13px] font-bold transition-colors cursor-pointer"
                style={{
                  color: mode === 'cv' ? 'var(--color-card-bg)' : 'var(--color-text-muted)'
                }}
              >
                {mode === 'cv' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-[12px] shadow-md"
                    style={{ backgroundColor: 'var(--color-sidebar-text)' }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2"><Eye size={15} /> CV View</span>
              </button>
              
              <div className="w-[1px] h-6 bg-[--color-border-soft] mx-1 z-10" />
              
              <button
                onClick={handleShare}
                className="relative z-10 flex items-center gap-2 rounded-[12px] px-4 py-2 text-[13px] font-bold transition-all cursor-pointer text-[--color-text-muted]"
              >
                {copied ? <Check size={15} className="text-green-500" /> : <Share size={15} />} {copied ? 'Copied!' : 'Share'}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'edit' ? (
            <motion.div
              key="edit-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <PersonalInfoSection />
              <SkillsLanguagesSection />
              <EducationSection />
              <ExperienceSection />
              <TaskilledSection />
              <LinksSection />
            </motion.div>
          ) : (
            <motion.div
              key="cv-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <CvView />
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  )
}

