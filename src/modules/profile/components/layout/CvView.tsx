import { useProfileQuery } from '@/modules/profile/api/profile.api'
import { useEducationQuery } from '@/modules/profile/api/education.api'
import { useExperienceQuery } from '@/modules/profile/api/experience.api'
import { useLinksQuery } from '@/modules/profile/api/links.api'
import { ExternalLink, Link as LinkIcon } from 'lucide-react'

function getLanguageLevelScore(level: string): number {
  if (!level) return 0;
  const l = level.toLowerCase();
  if (l.includes('native') || l.includes('bilingual') || l.includes('fluent') || l.includes('c2')) return 5;
  if (l.includes('advanced') || l.includes('c1')) return 4;
  if (l.includes('upper') || l.includes('b2')) return 4;
  if (l.includes('intermediate') || l.includes('b1')) return 3;
  if (l.includes('elementary') || l.includes('a2')) return 2;
  if (l.includes('beginner') || l.includes('basic') || l.includes('a1')) return 1;
  return 3;
}

export function CvView(): React.JSX.Element {
  const { data: profile } = useProfileQuery()
  const { data: education = [] } = useEducationQuery()
  const { data: experience = [] } = useExperienceQuery()
  const { data: links = [] } = useLinksQuery()

  return (
    <div className="rounded-[24px] bg-[--color-card-bg] p-12">
      {/* Header Info */}
      <div className="mb-12">
        <h1 className="mb-2 text-5xl font-serif font-bold text-[--color-sidebar-text]">
          {profile?.firstName} {profile?.lastName}
        </h1>
        <p className="text-xl text-[--color-brand-text] font-medium mb-4">
          {profile?.areasOfInterest || 'Professional'}
        </p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-[--color-text-muted]">
          {profile?.city && (
            <span>
              {profile.city.name}{profile.country ? `, ${profile.country.name}` : ''}
            </span>
          )}
          {profile?.phoneNumber && <span>{profile.phoneNumber}</span>}
          {profile?.webSite && <span>{profile.webSite}</span>}
        </div>
      </div>

      {/* About */}
      {profile?.bio && (
        <div className="mb-12">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[--color-text-muted]">About</h2>
          <p className="text-[15px] leading-relaxed text-[--color-sidebar-text]">
            {profile.bio}
          </p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-12">
          <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-[--color-text-muted]">Experience</h2>
          <div className="relative border-l-2 border-[--color-brand] pl-6 pb-2 space-y-8">
            {experience.map((exp) => (
              <div key={exp.id} className="relative">
                <div className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-[--color-brand] ring-4 ring-[--color-card-bg]" />
                <h3 className="text-lg font-bold text-[--color-sidebar-text]">{exp.company}</h3>
                <p className="text-sm font-medium text-[--color-brand-text] mb-1">{exp.position}</p>
                <p className="text-xs text-[--color-text-muted] mb-3">
                  {exp.startDate} — {exp.endDate || 'Present'}
                </p>
                {exp.description && (
                  <p className="text-sm text-[--color-sidebar-text] leading-relaxed">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-12">
          <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-[--color-text-muted]">Education</h2>
          <div className="relative border-l-2 border-[--color-brand] pl-6 pb-2 space-y-8">
            {education.map((edu) => (
              <div key={edu.id} className="relative">
                <div className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-[--color-brand] ring-4 ring-[--color-card-bg]" />
                <h3 className="text-lg font-bold text-[--color-sidebar-text]">{edu.schoolName}</h3>
                <p className="text-sm font-medium text-[--color-brand-text] mb-1">
                  {edu.fieldOfStudy ? `${edu.fieldOfStudy}, ${edu.degree}` : edu.degree}
                </p>
                <p className="text-xs text-[--color-text-muted]">
                  {edu.startDate} — {edu.endDate || 'Present'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {profile?.skills && profile.skills.length > 0 && (
        <div className="mb-12">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[--color-text-muted]">Skills</h2>
          <div className="flex flex-wrap gap-x-3 gap-y-2">
            {profile.skills.map((skill, index) => (
              <div key={skill.id} className="text-[14px] text-[--color-sidebar-text] flex items-center">
                <span className="font-semibold">{skill.name}</span>
                {index < (profile.skills?.length || 0) - 1 && (
                  <span className="text-[--color-border-soft] ml-3 font-bold">•</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {profile?.languages && profile.languages.length > 0 && (
        <div className="mb-12">
          <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-[--color-text-muted]">Languages</h2>
          <div className="flex flex-col gap-4 max-w-sm">
            {profile.languages.map((lang) => {
              const score = getLanguageLevelScore(lang.languageLevel);
              return (
                <div key={lang.id} className="flex items-center text-[14px]">
                  <span className="font-bold text-[--color-sidebar-text] w-[130px] shrink-0">{lang.language}</span>
                  <div className="flex items-center gap-1.5 w-[80px]">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div 
                        key={i} 
                        style={{ 
                          backgroundColor: i <= score ? 'var(--color-sidebar-text)' : 'var(--color-border-soft)',
                          WebkitPrintColorAdjust: 'exact',
                          printColorAdjust: 'exact' 
                        }}
                        className="h-[10px] w-[10px] shrink-0 rounded-full" 
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[--color-text-muted] ml-4">{lang.languageLevel}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Links */}
      {links.length > 0 && (
        <div>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[--color-text-muted]">Links</h2>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-[14px] font-medium text-[--color-sidebar-text] hover:text-[--color-brand-text] transition-colors"
              >
                <LinkIcon size={14} className="text-[--color-text-muted] group-hover:text-[--color-brand-text]" />
                <span className="underline decoration-[--color-border-soft] underline-offset-4 group-hover:decoration-[--color-brand-text]">
                  {link.linkType ? `${link.linkType}: ` : ''}{new URL(link.url).hostname.replace('www.', '')}
                </span>
                <ExternalLink size={12} className="opacity-0 -ml-1 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
