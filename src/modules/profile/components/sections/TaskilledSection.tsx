import { Award } from 'lucide-react'

import { SectionCard } from '@/modules/profile/components/shared/SectionCard'
import { useProfileQuery } from '@/modules/profile/api/profile.api'

export function TaskilledSection(): React.JSX.Element {
  const { data: profile, isLoading } = useProfileQuery()
  const certs = profile?.certificates ?? []

  return (
    <SectionCard 
      id="taskilled" 
      title="Taskilled Programs" 
      description="Certificates and programs you have completed on the platform."
      icon={<Award size={16} />}
    >
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => <div key={i} className="h-16 rounded-[14px] bg-[--color-surface-muted] animate-pulse" />)}
        </div>
      ) : certs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center" style={{ background: 'transparent', borderRadius: '16px' }}>
          <Award size={28} className="text-[--color-text-placeholder] mb-3 opacity-50" />
          <p className="text-[14px] font-medium text-[--color-text-muted]">No programs completed yet</p>
          <p className="mt-1 text-[12px] text-[--color-text-placeholder]">Programs will appear here once you complete them</p>
        </div>
      ) : (
        <div className="space-y-[4px]">
          {certs.map((cert, idx) => (
            <div key={cert.id}>
              {idx > 0 && <div style={{ borderTop: '1px solid var(--color-border-soft)', margin: '16px 0' }} />}
              <div
                className="flex items-start gap-[16px] rounded-[16px] p-2 hover:bg-[--color-ghost-bg] transition-colors"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[--color-field-bg]">
                  <Award size={20} className="text-[--color-brand-text]" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-[15px] font-bold text-[--color-sidebar-text]">{cert.name}</p>
                  <p className="text-[13px] text-[--color-text-muted] mt-1">
                    {cert.issuer ?? 'Taskilled'}{cert.issuedDate ? ` · ${cert.issuedDate}` : ''}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="font-semibold" style={{ background: 'var(--color-chip-bg)', color: 'var(--color-chip-fg)', borderRadius: '99px', padding: '4px 10px', fontSize: '11px' }}>
                    Verified
                  </span>
                  {cert.certificateUrl && (
                    <a
                      href={cert.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] font-semibold text-[--color-brand-text] hover:text-[--color-sidebar-text] transition-colors"
                    >
                      View PDF
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  )
}

