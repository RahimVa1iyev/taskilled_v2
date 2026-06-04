import { Code2, Globe2, Plus, X } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

import { SectionCard } from '@/modules/profile/components/shared/SectionCard'
import { useSkills } from '@/modules/profile/hooks/useSkills'
import { useLanguages } from '@/modules/profile/hooks/useLanguages'
import { lookupApi } from '@/shared/api/lookup/lookup.api'
import { FormSelect } from '@/shared/ui'
import { cn } from '@/shared/utils/cn'

const getLanguageLevelScore = (level: string) => {
  const l = level.toLowerCase();
  if (l.includes('native') || l.includes('fluent') || l.includes('bilingual')) return 5;
  if (l.includes('advanced') || l.includes('proficient') || l.includes('c1') || l.includes('c2')) return 4;
  if (l.includes('intermediate') || l.includes('b2') || l.includes('b1')) return 3;
  if (l.includes('elementary') || l.includes('basic') || l.includes('a2')) return 2;
  return 1;
};

function SkillSubsection({ isEditMode }: { isEditMode: boolean }) {
  const { skills, isLoading, isSaving, isDeleting, form, handleAdd, handleDelete } = useSkills()

  const { data: availableSkills = [] } = useQuery({
    queryKey: ['lookup', 'skills'],
    queryFn: lookupApi.getSkills,
    staleTime: 30 * 60 * 1000,
  })

  const skillOptions = availableSkills.map((s) => ({ value: s.id, label: s.name }))
  const levelOptions = ['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert'].map((l) => ({ value: l, label: l }))

  return (
    <div className="flex flex-col gap-4">
      <h3 className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.08em] text-[--color-text-muted]">
        <Code2 size={14} /> Skills
      </h3>
      
      {isEditMode && (
        <motion.form
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, scale: 0.95, height: 0 }}
          onSubmit={handleAdd}
          className="flex flex-wrap items-center gap-[12px] mb-8 rounded-[16px] p-5 bg-[--color-ghost-bg] border"
          style={{ borderColor: 'var(--color-border-soft)' }}
        >
          <div className="flex-1 min-w-[180px]">
            <FormSelect control={form.control} name="skillId" label="" placeholder="Select skill" options={skillOptions} />
          </div>
          <div className="flex-1 min-w-[140px]">
            <FormSelect control={form.control} name="level" label="" placeholder="Level" options={levelOptions} />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="submit"
              disabled={isSaving}
              className={cn(
                'flex items-center gap-2 rounded-[14px] bg-brand px-6 py-2.5 text-[14px] font-bold text-brand-on shadow-md shadow-brand/20 transition-all hover:shadow-lg hover:shadow-brand/40 hover:-translate-y-0.5 cursor-pointer',
                isSaving && 'opacity-60 cursor-not-allowed hover:translate-y-0 hover:shadow-md'
              )}
            >
              <Plus size={16} />
              {isSaving ? '...' : 'Add Skill'}
            </button>
          </div>
        </motion.form>
      )}

      {isLoading ? (
        <div className="flex gap-2">
          <div className="h-8 w-24 rounded-full bg-[--color-surface-muted] animate-pulse" />
          <div className="h-8 w-32 rounded-full bg-[--color-surface-muted] animate-pulse" />
        </div>
      ) : skills.length === 0 && !isEditMode ? (
        <div className="py-4 text-center">
          <p className="text-[12px] italic text-[--color-text-muted]">No skills added yet</p>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <AnimatePresence>
            {skills.map((skill) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className="group relative inline-flex items-center gap-2 rounded-[10px] border border-[--color-border-soft] px-3 py-1.5 text-[13.5px] transition-all hover:border-[--color-text-muted]"
                style={{ backgroundColor: 'var(--color-card-bg)' }}
              >
                <span className="font-semibold text-[--color-sidebar-text]">{skill.name}</span>
                {skill.level && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-[--color-border-soft]" />
                    <span className="text-[--color-text-muted]">{skill.level}</span>
                  </>
                )}
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => handleDelete(skill.id)}
                    disabled={isDeleting}
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white disabled:opacity-50 transition-colors ml-1"
                    title="Sil"
                  >
                    <X size={12} strokeWidth={3} />
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

function LanguageSubsection({ isEditMode }: { isEditMode: boolean }) {
  const { languages, isLoading, isSaving, isDeleting, form, handleAdd, handleDelete } = useLanguages()

  const { data: availableLanguages = [] } = useQuery({
    queryKey: ['lookup', 'languages'],
    queryFn: lookupApi.getLanguages,
    staleTime: 30 * 60 * 1000,
  })
  const { data: levels = [] } = useQuery({
    queryKey: ['lookup', 'languageLevels'],
    queryFn: lookupApi.getLanguageLevels,
    staleTime: 30 * 60 * 1000,
  })

  const languageOptions = availableLanguages.map((l) => ({ value: l.name, label: l.name }))
  const levelOptions = levels.map((l) => ({ value: l, label: l }))
  console.log(languageOptions, "languages")

  return (
    <div className="flex flex-col gap-4">
      <h3 className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.08em] text-[--color-text-muted]">
        <Globe2 size={14} /> Languages
      </h3>

      {isEditMode && (
        <motion.form
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, scale: 0.95, height: 0 }}
          onSubmit={handleAdd}
          className="flex flex-wrap items-center gap-[12px] mb-8 rounded-[16px] p-5 bg-[--color-ghost-bg] border"
          style={{ borderColor: 'var(--color-border-soft)' }}
        >
          <div className="flex-1 min-w-[150px]">
            <FormSelect control={form.control} name="language" label="" placeholder="Language" options={languageOptions} />
          </div>
          <div className="flex-1 min-w-[130px]">
            <FormSelect control={form.control} name="level" label="" placeholder="Level" options={levelOptions} />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="submit"
              disabled={isSaving}
              className={cn(
                'flex items-center gap-2 rounded-[14px] bg-brand px-6 py-2.5 text-[14px] font-bold text-brand-on shadow-md shadow-brand/20 transition-all hover:shadow-lg hover:shadow-brand/40 hover:-translate-y-0.5 cursor-pointer',
                isSaving && 'opacity-60 cursor-not-allowed hover:translate-y-0 hover:shadow-md'
              )}
            >
              <Plus size={16} />
              {isSaving ? '...' : 'Add Language'}
            </button>
          </div>
        </motion.form>
      )}

      <div className="flex flex-col gap-2 max-w-sm">
        {isLoading ? (
          <>
            {[1, 2].map((i) => (
              <div key={i} className="h-10 w-full rounded-[12px] bg-[--color-surface-muted] animate-pulse" />
            ))}
          </>
        ) : languages.length === 0 && !isEditMode ? (
          <div className="py-4 text-center">
            <p className="text-[12px] italic text-[--color-text-muted]">No languages added yet</p>
          </div>
        ) : (
          <AnimatePresence>
            {languages.map((lang) => {
              const score = getLanguageLevelScore(lang.languageLevel || '');
              return (
                <motion.div
                  key={lang.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  className="group flex items-center p-2 rounded-[12px] transition-colors hover:bg-[--color-ghost-bg]"
                >
                  <span className="font-bold text-[--color-sidebar-text] w-[130px] shrink-0 text-[14px]">{lang.language}</span>
                  <div className="flex items-center gap-1.5 w-[80px]">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div 
                        key={i} 
                        style={{ backgroundColor: i <= score ? 'var(--color-sidebar-text)' : 'var(--color-border-soft)' }}
                        className="h-[10px] w-[10px] shrink-0 rounded-full" 
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[--color-text-muted] ml-4 flex-1">{lang.languageLevel}</span>

                  {isEditMode && (
                    <button
                      onClick={() => handleDelete(lang.id)}
                      disabled={isDeleting}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500 shadow-sm hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 ml-auto"
                      title="Sil"
                    >
                      <X size={16} strokeWidth={2.5} />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

export function SkillsLanguagesSection(): React.JSX.Element {
  const [isEditMode, setIsEditMode] = useState(false)

  return (
    <SectionCard 
      id="skills" 
      title="Skills & Languages" 
      description="Showcase your professional toolkit and language proficiencies."
      icon={<Code2 size={16} />}
      isEditing={isEditMode}
      onEdit={() => setIsEditMode(!isEditMode)}
      editLabel="Düzəliş et"
    >
      <div className="flex flex-col gap-8 pt-4">
        <SkillSubsection isEditMode={isEditMode} />
        <div style={{
          borderTop: '1px dashed var(--color-border-soft)',
          width: '100%'
        }} />
        <LanguageSubsection isEditMode={isEditMode} />
      </div>
    </SectionCard>
  )
}

