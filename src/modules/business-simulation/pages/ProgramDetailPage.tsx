import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  Clock,
  Layout,
  CheckSquare,
  Award,
  Users,
  Globe,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Video as VideoIcon,
} from 'lucide-react'

import { useProgram } from '@/modules/business-simulation/api/queries/useProgram'
import { usePhasesByProgram } from '@/modules/business-simulation/api/queries/usePhasesByProgram'
import { useAssignmentsByPhases } from '@/modules/business-simulation/api/queries/useAssignmentsByPhases'
import { useMentorsByProgram } from '@/modules/business-simulation/api/queries/useMentorsByProgram'
import { useCohortsByProgram } from '@/modules/business-simulation/api/queries/useCohortsByProgram'
import { useMyEnrollments } from '@/modules/business-simulation/api/queries/useMyEnrollments'
import { usePrograms } from '@/modules/business-simulation/api/queries/usePrograms'
import { useCreateEnrollment } from '@/modules/business-simulation/api/enrollment.api'
import { toast } from '@/shared/lib/toast'

import { ROUTES } from '@/shared/constants/routes'
import { Spinner } from '@/shared/ui/custom/Spinner'
import { Modal } from '@/shared/ui/custom/Modal'
import { ProgramCard } from '@/modules/business-simulation/components/ProgramCard'
import { EnrollmentModal } from '@/modules/business-simulation/components/EnrollmentModal'
import type { AssignmentAllowedType, AssignmentResponse } from '@/modules/business-simulation/types/program.types'

export function ProgramDetailPage() {
  const { id } = useParams<{ id: string }>()
  const programId = Number(id)
  const navigate = useNavigate()

  const [openPhase, setOpenPhase] = useState<number>(0)
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false)
  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false)

  // API Queries
  const { data: program, isLoading: isLoadingProgram } = useProgram(programId)
  const { data: phases = [], isLoading: isLoadingPhases } = usePhasesByProgram(programId)
  
  const phaseIds = phases.map(p => p.id)
  const { assignmentsByPhase, isLoading: isLoadingAssignments } = useAssignmentsByPhases(phaseIds)
  
  const { data: mentors = [] } = useMentorsByProgram(programId)
  const { data: cohorts = [] } = useCohortsByProgram(programId)
  const { data: myEnrollments = [] } = useMyEnrollments()

  const { data: relatedProgramsData } = usePrograms({
    categoryId: program?.categoryId,
    page: 1,
    page_size: 4,
  })

  const createEnrollment = useCreateEnrollment()

  if (isLoadingProgram || isLoadingPhases || isLoadingAssignments) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner />
      </div>
    )
  }

  if (!program) {
    return <div className="text-center py-20 text-[--color-text-muted]">Program not found</div>
  }

  // Find enrollment for this specific program from all user enrollments
  const myEnrollment = myEnrollments.find(e => e.programId === program.id)
  const isEnrolled = !!myEnrollment
  
  const handleEnrollClick = () => {
    setIsEnrollModalOpen(true)
  }

  // Calculate total tasks
  const totalTasks = Object.values(assignmentsByPhase).reduce((acc, tasks) => acc + tasks.length, 0)
  
  // Mentor (using first mentor if exists)
  const mentor = mentors[0]
  
  // Next cohort
  const nextCohort = cohorts.find(c => new Date(c.startDate || '') > new Date()) || cohorts[0]

  const metas = [
    { icon: Clock, value: `${program.durationWeeks} weeks`, label: 'Duration', color: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200', glow: 'bg-blue-500/10' } },
    { icon: Layout, value: `${phases.length} phases`, label: 'Phases', color: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200', glow: 'bg-purple-500/10' } },
    { icon: CheckSquare, value: `${totalTasks} tasks`, label: 'Total tasks', color: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200', glow: 'bg-emerald-500/10' } },
    { icon: Award, value: 'Certificate', label: 'On completion', color: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200', glow: 'bg-amber-500/10' } },
    { icon: Users, value: program.hasMentor ? 'Mentor support' : 'Self-paced', label: 'Guided', color: { bg: 'bg-rose-100', text: 'text-rose-600', border: 'border-rose-200', glow: 'bg-rose-500/10' } },
    { icon: Globe, value: 'Remote', label: 'Work type', color: { bg: 'bg-teal-100', text: 'text-teal-600', border: 'border-teal-200', glow: 'bg-teal-500/10' } },
  ]

  const related = (relatedProgramsData?.results || []).filter(p => p.id !== programId).slice(0, 3)

  const getTaskIcon = (types: AssignmentAllowedType[]) => {
    if (types.includes('video')) return VideoIcon
    if (types.includes('image')) return ImageIcon
    if (types.includes('link')) return LinkIcon
    return FileText
  }

  const getTaskTypeLabel = (types: AssignmentAllowedType[]) => {
    if (!types || types.length === 0) return 'text'
    return types.join(' + ')
  }

  return (
    <div className="">
      <Link to={ROUTES.APP.PROGRAMS} className="text-[--color-text-muted] text-[13px] hover:text-[--color-sidebar-text] flex items-center gap-1 mb-4 font-medium">
        ← Programs
      </Link>

      <div className="lg:flex lg:gap-10">
        <div className="lg:w-[60%]">
          {/* HERO */}
          <div className="flex gap-2.5 flex-wrap">
            <span className="bg-[--color-brand]/10 border border-[--color-brand]/20 text-[--color-sidebar-text] text-[12px] font-bold px-3 py-1 rounded-full shadow-sm">
              {program.category?.name || 'Category'}
            </span>
            {program.price === 0 ? (
              <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[12px] font-bold px-3 py-1 rounded-full shadow-sm">
                Free
              </span>
            ) : (
              <span className="bg-amber-50 border border-amber-200 text-amber-700 text-[12px] font-bold px-3 py-1 rounded-full shadow-sm">
                Paid
              </span>
            )}
            {program.hasMentor && (
              <span className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-[12px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Mentor
              </span>
            )}
            {program.hasCohort && (
              <span className="bg-sky-50 border border-sky-200 text-sky-700 text-[12px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Cohort
              </span>
            )}
          </div>

          <h1 className="text-[--color-sidebar-text] text-[32px] md:text-[38px] font-extrabold mt-4 leading-tight">
            {program.title}
          </h1>

          <div className="flex items-center gap-3 mt-4">
            <div className="w-8 h-8 rounded-full bg-[--color-ghost-bg] border border-[--color-ghost-border] flex items-center justify-center text-[--color-text-muted] text-[11px] font-bold">
              {/* PLACEHOLDER: Company abbreviation missing from API */}
              C
            </div>
            {/* PLACEHOLDER: Company name missing from API */}
            <span className="text-[--color-sidebar-text] font-semibold text-[15px]">Company Name</span>
            <span className="bg-[#DCFCE7] text-[#166534] text-[11px] font-medium px-2 py-0.5 rounded-full">
              Verified
            </span>
          </div>

          <p className="text-[--color-text-muted] text-[15px] leading-relaxed mt-6 whitespace-pre-wrap">{program.description}</p>

          {/* META GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mt-10">
            {metas.map((m) => (
              <div key={m.label} className="relative overflow-hidden bg-white border border-zinc-100 rounded-3xl p-5 flex flex-col justify-between hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.07)] hover:-translate-y-1.5 transition-all duration-400 group cursor-default shadow-sm">
                {/* Decorative subtle glow specific to the card color */}
                <div className={`absolute -top-10 -right-10 w-32 h-32 ${m.color.glow} blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className={`w-14 h-14 rounded-2xl ${m.color.bg} border ${m.color.border} flex items-center justify-center mb-6 group-hover:scale-[1.15] group-hover:rotate-3 transition-transform duration-500`}>
                  <m.icon className={`w-6 h-6 ${m.color.text} drop-shadow-sm transition-colors duration-300`} />
                </div>
                <div className="relative z-10">
                  <p className="text-zinc-900 font-black text-[18px] leading-tight tracking-tight">{m.value}</p>
                  <p className="text-zinc-500 font-medium text-[14px] mt-1.5">{m.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* WHAT YOU'LL LEARN */}
          {/* PLACEHOLDER: Learning outcomes missing from API */}
          <div className="mt-10">
            <h2 className="text-[--color-sidebar-text] font-bold text-[20px] mb-4">What you'll learn</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-[--color-warn] flex-shrink-0 mt-0.5" />
                <span className="text-[--color-sidebar-text] text-[14px]">Placeholder outcome 1</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-[--color-warn] flex-shrink-0 mt-0.5" />
                <span className="text-[--color-sidebar-text] text-[14px]">Placeholder outcome 2</span>
              </div>
            </div>
            <p className="text-xs text-[--color-text-muted] mt-3 italic bg-[--color-ghost-bg] p-2 rounded-lg border border-[--color-border-soft]">
              Məlumat: 'What you'll learn' hissəsi backend-də mövcud olmadığı üçün hələlik placeholder olaraq saxlanılıb.
            </p>
          </div>

          {/* PHASES */}
          <div className="mt-12">
            <h2 className="text-[--color-sidebar-text] font-extrabold text-[22px] tracking-tight mb-5">Program structure</h2>
            {phases.length === 0 ? (
              <p className="text-sm text-[--color-text-muted]">No phases available.</p>
            ) : (
              phases.map((phase, idx) => {
                const open = openPhase === idx;
                const tasks = assignmentsByPhase[phase.id] || [];
                return (
                  <div
                    key={phase.id}
                    className={`bg-white border ${open ? 'border-indigo-500 shadow-[0_15px_30px_-10px_rgba(99,102,241,0.15)] ring-4 ring-indigo-500/10 scale-[1.01]' : 'border-zinc-200 hover:border-zinc-300 hover:shadow-md hover:bg-zinc-50/50'} rounded-3xl mb-4 overflow-hidden transition-all duration-400`}
                  >
                    <button
                      onClick={() => setOpenPhase(open ? -1 : idx)}
                      className="w-full flex items-center gap-4 sm:gap-5 p-5 sm:p-6 cursor-pointer text-left transition-colors"
                    >
                      <div className={`w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center font-extrabold text-[16px] transition-all duration-400 ${open ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-110' : 'bg-zinc-100 text-zinc-600 border border-zinc-200'}`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className={`font-black text-[17px] tracking-tight transition-colors ${open ? 'text-zinc-900' : 'text-zinc-800'}`}>{phase.title}</p>
                        {phase.description && (
                          <p className="text-zinc-500 font-medium text-[14px] mt-1.5 line-clamp-1">
                            {phase.description}
                          </p>
                        )}
                      </div>
                      <div className="ml-auto flex items-center gap-4">
                        <span className={`text-[12.5px] font-bold px-3.5 py-1.5 rounded-full transition-colors ${open ? 'bg-indigo-100 text-indigo-700' : 'bg-zinc-100 text-zinc-600'}`}>
                          {tasks.length} tasks
                        </span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${open ? 'bg-indigo-50' : 'bg-transparent group-hover:bg-zinc-100'}`}>
                          {open ? (
                            <ChevronUp className="text-indigo-600 w-5 h-5" />
                          ) : (
                            <ChevronDown className="text-zinc-400 w-5 h-5" />
                          )}
                        </div>
                      </div>
                    </button>
                    {open && (
                      <div className="bg-indigo-50/30 border-t border-indigo-100 px-6 py-6">
                        {phase.description && (
                          <p className="text-indigo-900/80 font-medium text-[14px] leading-relaxed italic border-l-[4px] rounded-l-sm border-indigo-400 pl-4 py-1 mb-6 bg-white p-3 shadow-sm">
                            {phase.description}
                          </p>
                        )}
                        <div className="flex flex-col gap-3">
                          {tasks.length === 0 ? (
                            <p className="text-sm text-[--color-text-muted]">No tasks in this phase.</p>
                          ) : (
                            tasks.map((t: AssignmentResponse) => {
                              const Icon = getTaskIcon(t.allowedTypes);
                              return (
                                <div
                                  key={t.id}
                                  className="group relative flex items-center gap-4 bg-white rounded-2xl p-4 border border-indigo-100/50 shadow-sm hover:border-indigo-300 hover:shadow-[0_8px_20px_-5px_rgba(99,102,241,0.1)] hover:scale-[1.01] transition-all duration-300 overflow-hidden cursor-default"
                                >
                                  <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-zinc-100 group-hover:bg-indigo-500 transition-colors duration-300" />
                                  <div className="w-12 h-12 shrink-0 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center group-hover:bg-indigo-100 transition-colors duration-300">
                                    <Icon className="w-5 h-5 text-indigo-500 group-hover:text-indigo-700 transition-colors duration-300" />
                                  </div>
                                  <div className="flex-1">
                                    <span className="text-zinc-900 text-[16px] font-extrabold tracking-tight block">
                                      {t.title}
                                    </span>
                                    {t.difficultyLevel && (
                                      <span className="text-zinc-500 font-medium text-[13px] mt-1 block capitalize">
                                        Difficulty: {t.difficultyLevel}
                                      </span>
                                    )}
                                  </div>
                                  <span className="ml-auto bg-orange-50 border border-orange-100 text-orange-600 text-[11.5px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 transition-all duration-300">
                                    {getTaskTypeLabel(t.allowedTypes)}
                                  </span>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* MENTOR */}
          {mentor && (
            <div className="mt-12">
              <h2 className="text-[--color-sidebar-text] font-bold text-[20px] mb-4">Your mentor</h2>
              <div className="bg-white border border-[--color-border-soft] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start gap-4 sm:gap-5 hover:shadow-md hover:border-[--color-brand]/30 transition-all duration-300">
                {mentor.user?.imgUrl ? (
                  <img src={mentor.user.imgUrl} alt="Mentor" className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover" />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[--color-brand] flex items-center justify-center font-bold text-[--color-brand-on] text-[20px] sm:text-[24px]">
                    {mentor.user?.firstName?.[0] || ''}{mentor.user?.lastName?.[0] || ''}
                  </div>
                )}
                <div>
                  <p className="text-[--color-sidebar-text] font-bold text-[18px]">
                    {mentor.user?.firstName} {mentor.user?.lastName}
                  </p>
                  <p className="text-[--color-text-muted] text-[14px] font-medium capitalize mt-0.5">{mentor.type} Mentor</p>
                  {/* PLACEHOLDER: Mentor bio and tags missing from API */}
                  <p className="text-[--color-text-muted] text-[14px] mt-2.5 leading-relaxed">
                    Mentor bio placeholder. This information is currently not available from the API.
                  </p>
                  <div className="flex gap-2 mt-3.5 flex-wrap">
                    <span className="bg-[--color-ghost-bg] text-[--color-text-muted] text-[12px] font-medium px-2.5 py-1 rounded-full">
                      Tag 1
                    </span>
                  </div>
                  <p className="text-xs text-[--color-text-muted] mt-3 italic bg-[--color-ghost-bg] p-2 rounded-lg border border-[--color-border-soft] inline-block">
                    Məlumat: Mentor title, bio və tags backend-də mövcud deyil.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* RELATED */}
          {related.length > 0 && (
            <div className="mt-14">
              <h2 className="text-[--color-sidebar-text] font-bold text-[20px] mb-4">Similar programs</h2>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 pb-2">
                {related.map((r) => (
                  <ProgramCard key={r.id} program={r} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT CTA */}
        <div className="lg:w-[32%] mt-8 lg:mt-0">
          <div className="bg-white border border-zinc-200/80 rounded-[32px] p-6 sm:p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] lg:sticky lg:top-8 relative overflow-hidden">
            {/* Dynamic vibrant top border line */}
            <div className="absolute top-0 left-0 right-0 h-[6px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
            
            {/* Soft ambient glow from the top */}
            <div className="absolute -top-16 right-0 w-64 h-64 bg-purple-500/5 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute top-20 -left-10 w-48 h-48 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 pt-2">
              {program.price === 0 ? (
                <>
                  <p className="text-zinc-900 text-[46px] font-black leading-none tracking-tight">Free</p>
                  <p className="text-zinc-500 text-[15px] mt-2 font-medium">No payment required</p>
                </>
              ) : (
                <>
                  <p className="leading-none flex items-baseline">
                    <span className="text-zinc-900 text-[46px] font-black tracking-tight">
                      {program.price}
                    </span>
                    <span className="text-zinc-500 text-[18px] ml-1.5 uppercase font-bold">
                      {program.currency}
                    </span>
                  </p>
                  <p className="text-zinc-500 text-[15px] mt-2 font-medium">One-time payment</p>
                </>
              )}

              <div className="mt-8 flex flex-col gap-4.5">
                {[
                  "Lifetime access to all materials",
                  "Certificate on completion",
                  program.hasMentor ? "Mentor feedback on every task" : "Self-paced learning",
                  "Portfolio ready projects",
                ].map((line) => (
                  <div key={line} className="flex items-start gap-3.5">
                    <CheckCircle className="w-[22px] h-[22px] text-emerald-500 shrink-0" />
                    <span className="text-zinc-700 text-[15.5px] font-medium leading-snug">{line}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-100 my-8" />

              {program.hasCohort ? (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 mb-7 border border-indigo-100/50">
                  {nextCohort ? (
                    <>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-[20px] h-[20px] text-indigo-600" />
                        <span className="text-indigo-950 text-[15px] font-extrabold tracking-tight">
                          Next cohort: {nextCohort.startDate ? new Date(nextCohort.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-3">
                        <Users className="w-[20px] h-[20px] text-indigo-400" />
                        <span className="text-indigo-600/80 text-[14.5px] font-medium">
                          Spots available: {nextCohort.maxSeats || 'Unlimited'}
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="text-[14.5px] text-zinc-500 font-medium">No active cohorts</p>
                  )}
                </div>
              ) : (
                <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-5 mb-7 border border-teal-100/50">
                  <div className="flex items-center gap-3">
                    <Globe className="w-[20px] h-[20px] text-teal-600" />
                    <span className="text-teal-950 text-[15px] font-extrabold tracking-tight">
                      Start anytime
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <Users className="w-[20px] h-[20px] text-teal-400" />
                    <span className="text-teal-700/80 text-[14.5px] font-medium">Self-paced learning</span>
                  </div>
                </div>
              )}

              {myEnrollment ? (
                myEnrollment.status === 'pending' ? (
                  <button
                    disabled
                    className="bg-amber-50 text-amber-600 font-bold w-full py-4.5 rounded-[20px] text-[16px] transition-all cursor-not-allowed border border-amber-200 shadow-sm"
                  >
                    Pending Approval
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/workspace/${program.id}`)}
                    className="bg-zinc-900 text-white hover:bg-zinc-800 font-bold w-full py-4.5 rounded-[20px] text-[16px] active:scale-[0.98] transition-all shadow-lg"
                  >
                    Go to Workspace
                  </button>
                )
              ) : (
                <button
                  onClick={handleEnrollClick}
                  className="bg-[#D1E728] text-zinc-900 hover:bg-[#c3d922] hover:-translate-y-1 font-extrabold w-full py-4.5 rounded-[20px] text-[16px] active:scale-[0.98] transition-all shadow-[0_15px_30px_rgba(209,231,40,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {program.price === 0 ? "Join for free" : "Apply now"}
                </button>
              )}

              {!isEnrolled && (
                <p
                  onClick={() => navigate(ROUTES.AUTH.LOGIN)}
                  className="text-zinc-500 text-[14.5px] font-semibold text-center mt-6 cursor-pointer hover:text-zinc-900 transition-colors"
                >
                  Already enrolled? Login to continue →
                </p>
              )}

              {program.price > 0 && !isEnrolled && (
                <p className="text-zinc-400 text-[13.5px] font-medium text-center mt-3">
                  30-day money back guarantee
                </p>
              )}
              
              <p className="text-[11.5px] text-zinc-400 mt-7 text-center italic leading-relaxed px-4">
                Company Name (Logo, Name) api-də olmadığı üçün Placeholder olaraq qalıb.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {program && (
        <EnrollmentModal 
          isOpen={isEnrollModalOpen}
          onClose={() => setIsEnrollModalOpen(false)}
          programId={program.id}
          programTitle={program.title}
          onSuccess={(enrollmentData) => {
            setIsEnrollModalOpen(false)
            if (enrollmentData.status === 'pending') {
              setIsPendingModalOpen(true)
            } else {
              toast.success('Successfully enrolled!')
              navigate(`/workspace/${program.id}`)
            }
          }}
        />
      )}

      <Modal
        isOpen={isPendingModalOpen}
        onClose={() => setIsPendingModalOpen(false)}
        title="Müraciətiniz qəbul olundu"
        description="Sizin müraciətinizə baxılacaq və nəticə barədə sizə məlumat veriləcək. Təşəkkür edirik."
      >
        <div className="flex justify-end pt-2">
          <button
            onClick={() => setIsPendingModalOpen(false)}
            className="px-6 py-2.5 rounded-xl text-[14.5px] font-bold text-white bg-zinc-900 hover:bg-zinc-800 transition-colors"
          >
            Bağla
          </button>
        </div>
      </Modal>
    </div>
  )
}
