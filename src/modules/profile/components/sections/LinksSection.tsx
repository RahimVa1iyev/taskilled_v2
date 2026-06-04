import {
  Link as LinkIcon, Plus, X,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { SectionCard } from '@/modules/profile/components/shared/SectionCard'
import { useLinks } from '@/modules/profile/hooks/useLinks'
import { FormInput } from '@/shared/ui'
import { cn } from '@/shared/utils/cn'

function getLinkLabel(_linkType: string | null, url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return 'Link'
  }
}

// ─── LinksSection ─────────────────────────────────────────────────────────────

export function LinksSection(): React.JSX.Element {
  const {
    links, isLoading, isCreating, isDeleting,
    isFormOpen, setIsFormOpen,
    form, handleCreate, handleDelete,
  } = useLinks()

  return (
    <SectionCard
      id="links"
      title="Links"
      description="Add your LinkedIn, GitHub, YouTube, or any relevant professional links."
      icon={<LinkIcon size={16} />}
      isEditing={isFormOpen}
      onEdit={() => setIsFormOpen(!isFormOpen)}
      editLabel="Düzəliş et"
    >
      <div className="space-y-[24px]">
        {/* Form is always visible in Edit Mode */}
        {isFormOpen && (
          <motion.form
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, scale: 0.95, height: 0 }}
            onSubmit={handleCreate}
            className="space-y-[16px] mb-8 rounded-[16px] p-5 bg-[--color-ghost-bg] border"
            style={{ borderColor: 'var(--color-border-soft)' }}
          >
            <FormInput
              control={form.control}
              name="url"
              label="URL"
              placeholder="https://..."
            />
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isCreating}
                className={cn(
                  'flex items-center gap-2 rounded-[14px] bg-brand px-6 py-2.5 text-[14px] font-bold text-brand-on shadow-md shadow-brand/20 transition-all hover:shadow-lg hover:shadow-brand/40 hover:-translate-y-0.5 cursor-pointer',
                  isCreating && 'opacity-60 cursor-not-allowed hover:translate-y-0 hover:shadow-md'
                )}
              >
                <Plus size={16} />
                {isCreating ? 'Saving...' : 'Add Link'}
              </button>
            </div>
          </motion.form>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {[1].map((i) => (
              <div key={i} className="h-12 w-full rounded-[14px] bg-[--color-surface-muted] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-x-8 gap-y-3 pt-2">
            <AnimatePresence>
              {links.length === 0 && !isLoading ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full py-4 text-center"
                >
                  <p className="text-[12px] italic text-[--color-text-muted]">No links added yet</p>
                </motion.div>
              ) : (
                links.map((link) => (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group relative flex items-center gap-2 pr-2 rounded-[8px] transition-colors hover:bg-[--color-ghost-bg]"
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-1.5 text-[14px] font-medium text-[--color-sidebar-text] hover:text-[--color-brand-text] transition-colors"
                    >
                      <LinkIcon size={14} className="text-[--color-text-muted] group-hover:text-[--color-brand-text]" />
                      <span className="underline decoration-[--color-border-soft] underline-offset-4 group-hover:decoration-[--color-brand-text]">
                        {link.linkType ? `${link.linkType}: ` : ''}{getLinkLabel(link.linkType, link.url)}
                      </span>
                    </a>
                    {isFormOpen && (
                      <button
                        onClick={() => handleDelete(link.id)}
                        disabled={isDeleting}
                        className="flex h-6 w-6 ml-2 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500 shadow-sm hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                        title="Sil"
                      >
                        <X size={12} strokeWidth={2.5} />
                      </button>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </SectionCard>
  )
}


