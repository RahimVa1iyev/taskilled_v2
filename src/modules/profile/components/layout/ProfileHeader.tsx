import { useState } from 'react'
import { motion } from 'framer-motion'
import { Pencil, Eye, Share, Download, Check } from 'lucide-react'

import { useProfileQuery } from '@/modules/profile/api/profile.api'

interface ProfileHeaderProps {
  isCvView: boolean
  setIsCvView: (val: boolean) => void
}

export function ProfileHeader({ isCvView, setIsCvView }: ProfileHeaderProps): React.JSX.Element {
  const { data: profile, isLoading } = useProfileQuery()
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

  if (isLoading) {
    return (
      <div className="px-6 py-8 md:px-8">
        <div className="mx-auto max-w-2xl animate-pulse space-y-4">
          <div className="h-4 w-32 rounded bg-[--color-surface-muted]" />
          <div className="h-8 w-64 rounded bg-[--color-surface-muted]" />
          <div className="h-4 w-96 rounded bg-[--color-surface-muted]" />
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 py-8 md:px-8">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between"
        >
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[--color-text-muted]">
              Edit Your Profile
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-[--color-sidebar-text]">
              Hello, <span style={{ color: 'var(--color-brand-text)' }}>{profile?.firstName || 'User'}</span>
            </h1>
            <p className="text-sm text-[--color-text-muted]">
              Fill in the sections below — your CV updates live. Toggle to preview anytime.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <div className="relative flex items-center gap-1 rounded-[16px] bg-[--color-card-bg] p-1.5 border border-[--color-border-soft] shadow-sm">
              <button
                onClick={() => setIsCvView(false)}
                className={`relative z-10 flex items-center gap-2 rounded-[12px] px-4 py-2 text-[13px] font-bold transition-colors cursor-pointer ${
                  !isCvView ? 'text-white' : 'text-[--color-text-muted] hover:text-[--color-sidebar-text]'
                }`}
              >
                {!isCvView && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-[12px] bg-[--color-sidebar-text] shadow-md"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2"><Pencil size={15} /> Edit</span>
              </button>
              
              <button
                onClick={() => setIsCvView(true)}
                className={`relative z-10 flex items-center gap-2 rounded-[12px] px-4 py-2 text-[13px] font-bold transition-colors cursor-pointer ${
                  isCvView ? 'text-white' : 'text-[--color-text-muted] hover:text-[--color-sidebar-text]'
                }`}
              >
                {isCvView && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-[12px] bg-[--color-sidebar-text] shadow-md"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2"><Eye size={15} /> CV View</span>
              </button>
              
              <div className="w-[1px] h-6 bg-[--color-border-soft] mx-1 z-10" />
              
              <button
                onClick={handleShare}
                className="relative z-10 flex items-center gap-2 rounded-[12px] px-4 py-2 text-[13px] font-bold transition-all cursor-pointer text-[--color-text-muted] hover:text-brand-text hover:bg-brand/10"
              >
                {copied ? <Check size={15} className="text-green-500" /> : <Share size={15} />} {copied ? 'Copied!' : 'Share'}
              </button>
            </div>
            
            <button className="flex items-center gap-2 rounded-[16px] bg-brand px-5 py-2.5 text-[13px] font-bold text-brand-on shadow-md shadow-brand/20 transition-all hover:shadow-lg hover:shadow-brand/40 hover:-translate-y-0.5 cursor-pointer">
              <Download size={15} /> Export PDF
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
