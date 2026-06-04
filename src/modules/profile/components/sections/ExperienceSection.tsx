import {
  Briefcase, Plus, X,
  Building2, CalendarDays
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { SectionCard } from '@/modules/profile/components/shared/SectionCard'
import { useExperience } from '@/modules/profile/hooks/useExperience'
import { FormInput, FormTextarea } from '@/shared/ui'
import { cn } from '@/shared/utils/cn'

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Present'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export function ExperienceSection(): React.JSX.Element {
  const {
    experiences, isLoading, isCreating, isDeleting,
    isFormOpen, setIsFormOpen,
    form, handleCreate, handleDelete,
  } = useExperience()



  return (
    <SectionCard
      id="experience"
      title="Experience"
      description="List your work experience, internships, and volunteer roles to show your career progression."
      icon={<Briefcase size={16} />}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              <FormInput control={form.control} name="position" label="Role / Position" placeholder="e.g. Frontend Developer" />
              <FormInput control={form.control} name="company" label="Company" placeholder="e.g. Google" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              <FormInput control={form.control} name="startDate" label="Start Date" type="date" />
              <FormInput control={form.control} name="endDate" label="End Date (leave empty if present)" type="date" />
            </div>

            <FormTextarea control={form.control} name="description" label="Description" placeholder="Describe your responsibilities and achievements..." rows={3} />

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
                {isCreating ? 'Saving...' : 'Add Experience'}
              </button>
            </div>
          </motion.form>
        )}

        {/* Data List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 w-full rounded-[14px] bg-[--color-surface-muted] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-[4px]">
            <AnimatePresence>
              {experiences.length === 0 && !isLoading ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                  style={{ background: 'transparent', borderRadius: '16px' }}
                >
                  <Briefcase size={28} className="text-[--color-text-placeholder] mb-3 opacity-50" />
                  <p className="text-[14px] font-medium text-[--color-text-muted]">No experience added yet</p>
                  <p className="mt-1 text-[12px] text-[--color-text-placeholder]">Add your work history to stand out</p>
                </motion.div>
              ) : (
                experiences.map((exp, idx) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                  >
                    {idx > 0 && <div style={{ borderTop: '1px solid var(--color-border-soft)', margin: '16px 0' }} />}
                    <div className="group relative flex flex-col sm:flex-row items-start gap-4 rounded-[20px] border border-[--color-border-soft] p-5 hover:border-[--color-text-muted] hover:shadow-sm transition-all bg-[--color-card-bg] hover:bg-[--color-ghost-bg]">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[--color-field-bg] text-[--color-brand-text]">
                        <Building2 size={22} />
                      </div>
                      <div className="flex-1 min-w-0 w-full pt-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                          <div>
                            <p className="text-[17px] font-bold text-[--color-sidebar-text]">{exp.company}</p>
                            <p className="text-[15px] font-medium mt-1 text-[--color-brand-text] flex items-center gap-1.5">
                              <Briefcase size={14} /> {exp.position}
                            </p>
                          </div>
                          <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[--color-field-bg] text-[12px] font-medium text-[--color-text-muted] border border-[--color-border-soft]">
                            <CalendarDays size={13} />
                            {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
                          </div>
                        </div>

                        {exp.description && (
                          <div className="mt-4 pt-4 border-t border-dashed border-[--color-border-soft]">
                            <p className="text-[13.5px] leading-relaxed text-[--color-text-muted] whitespace-pre-wrap">
                              {exp.description}
                            </p>
                          </div>
                        )}
                        
                        {isFormOpen && (
                          <button
                            onClick={() => handleDelete(exp.id)}
                            disabled={isDeleting}
                            className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-500 shadow-sm hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 border border-red-200"
                            title="Sil"
                          >
                            <X size={14} strokeWidth={2.5} />
                          </button>
                        )}
                      </div>
                    </div>
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
