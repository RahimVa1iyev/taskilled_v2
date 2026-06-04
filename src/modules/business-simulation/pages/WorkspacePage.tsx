import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  CheckCircle,
  Clock,
  MessageSquare,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Lock,
} from 'lucide-react'
import { toast } from '@/shared/lib/toast'
import { useProgram } from '@/modules/business-simulation/api/queries/useProgram'
import { usePhasesByProgram } from '@/modules/business-simulation/api/queries/usePhasesByProgram'
import { useAssignmentsByPhases } from '@/modules/business-simulation/api/queries/useAssignmentsByPhases'
import { useMyEnrollments } from '@/modules/business-simulation/api/enrollment.api'
import { 
  useSubmissionsByEnrollment, 
  useCreateSubmission,
  useSubmissionBlocks,
  useCreateSubmissionBlock,
  useSubmitSubmission 
} from '@/modules/business-simulation/api/submission.api'
import { Spinner } from '@/shared/ui/custom/Spinner'
import { Sheet } from '@/shared/ui/custom/Sheet'
import type { AssignmentResponse } from '@/modules/business-simulation/types/program.types'

type TaskStatus = 'Done' | 'In Progress' | 'To Do' | 'Review' | 'Locked'

function statusBadge(s: TaskStatus) {
  switch (s) {
    case 'Done': return 'bg-[#EAF3DE] text-[#27500A]'
    case 'In Progress': return 'bg-[#D1E728]/15 text-[#92800A]'
    case 'Review': return 'bg-[#FFF3E0] text-[#854F0B]'
    case 'Locked': return 'bg-[#F5F5F0] text-[#A8A29E]'
    default: return 'bg-[#F5F5F0] text-[#78716C]'
  }
}

type BoardCard = {
  id: number
  name: string
  outcome: string
  types: ('text' | 'image' | 'link')[]
  status: TaskStatus
  hasFeedback?: boolean
  inReview?: boolean
  submissionId?: number
}

function TypeBadge({ type }: { type: 'text' | 'image' | 'link' }) {
  const Icon = type === 'text' ? FileText : type === 'image' ? ImageIcon : LinkIcon
  const label = type === 'text' ? 'Text' : type === 'image' ? 'Image' : 'Link'
  return (
    <span className="bg-[#F5F5F0] text-[#78716C] text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1">
      <Icon className="w-3 h-3" />
      {label}
    </span>
  )
}

function KanbanCard({ card, onClick }: { card: BoardCard; onClick: () => void }) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('cardId', card.id.toString())
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={onClick}
      className="bg-white border border-[#E7E5E4] rounded-2xl p-4 hover:shadow-md hover:border-[#D1E728]/40 transition-all duration-200 cursor-grab active:cursor-grabbing relative group"
    >
      {card.status === 'Done' && (
        <CheckCircle className="absolute top-3 right-3 w-4 h-4 text-[#27500A]" />
      )}
      <div className="flex gap-1 mb-2 flex-wrap">
        {card.types.map((t) => (
          <TypeBadge key={t} type={t} />
        ))}
      </div>
      <p className="text-[#1C1917] font-semibold text-[14px] leading-snug group-hover:text-indigo-600 transition-colors">{card.name}</p>
      <p className="text-[#78716C] text-[12px] leading-relaxed mt-1 line-clamp-2">
        {card.outcome}
      </p>
      <div className="mt-3 flex items-center">
        <span className="bg-[#D1E728]/10 text-[#92800A] text-[11px] px-2 py-0.5 rounded-full">
          Task
        </span>
        <div className="ml-auto flex items-center gap-2">
          {card.hasFeedback && <MessageSquare className="w-3.5 h-3.5 text-[#534AB7]" />}
          {card.inReview && <Clock className="w-3.5 h-3.5 text-amber-500" />}
        </div>
      </div>
    </div>
  )
}

function BoardView({ 
  phases, 
  activePhaseIdx, 
  setActivePhaseIdx, 
  cards,
  onOpenTask,
  onMoveTask
}: { 
  phases: any[]
  activePhaseIdx: number
  setActivePhaseIdx: (i: number) => void
  cards: BoardCard[]
  onOpenTask: (card: BoardCard) => void 
  onMoveTask: (cardId: number, newStatus: TaskStatus) => void
}) {
  const columns: { name: string; status: TaskStatus; dot: string }[] = [
    { name: 'To Do', status: 'To Do', dot: 'bg-[#E7E5E4]' },
    { name: 'In Progress', status: 'In Progress', dot: 'bg-[#D1E728] animate-pulse' },
    { name: 'Review', status: 'Review', dot: 'bg-amber-400' },
    { name: 'Done', status: 'Done', dot: 'bg-[#27500A]' },
  ]

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: TaskStatus) => {
    e.preventDefault()
    e.currentTarget.classList.remove('bg-zinc-100')
    const cardIdStr = e.dataTransfer.getData('cardId')
    if (cardIdStr) {
      onMoveTask(Number(cardIdStr), newStatus)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.classList.add('bg-zinc-100')
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.classList.remove('bg-zinc-100')
  }

  return (
    <div className="flex-1 flex flex-col h-full rounded-[24px] bg-[#FAFAF5] border border-zinc-200 overflow-hidden shadow-sm">
      {/* Phase selector */}
      <div className="bg-white border-b border-[#E7E5E4] px-6 py-4 overflow-x-auto shrink-0 scrollbar-hide">
        <div className="flex gap-2 min-w-max">
          {phases.map((phase, idx) => {
            const isLocked = false // Compute based on completed phases later
            const active = activePhaseIdx === idx
            return (
              <button
                key={phase.id}
                disabled={isLocked}
                onClick={() => !isLocked && setActivePhaseIdx(idx)}
                className={`px-4 py-2 rounded-xl text-[14px] font-medium cursor-pointer transition-all flex items-center ${
                  active
                    ? 'bg-[#1C1917] text-white font-semibold shadow-md'
                    : isLocked
                      ? 'opacity-40 cursor-not-allowed text-[#78716C]'
                      : 'text-[#78716C] hover:bg-zinc-100'
                }`}
              >
                {isLocked && <Lock className="w-3 h-3 mr-1" />}
                Phase {idx + 1}: {phase.title}
              </button>
            )
          })}
        </div>
      </div>

      {/* Kanban columns */}
      <div className="flex-1 px-6 py-6 overflow-x-auto overflow-y-hidden scrollbar-hide">
        <div className="flex gap-6 min-w-max h-full">
          {columns.map((col) => {
            const colCards = cards.filter((c) => c.status === col.status)
            return (
              <div 
                key={col.name} 
                className="w-[290px] flex-shrink-0 flex flex-col h-full bg-zinc-50/80 rounded-2xl p-2 transition-colors duration-200 border border-zinc-100"
                onDrop={(e) => handleDrop(e, col.status)}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
              >
                <div className="flex items-center gap-2 mb-3 px-2 pt-2">
                  <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                  <span className="text-zinc-800 text-[13px] font-extrabold uppercase tracking-widest">
                    {col.name}
                  </span>
                  <span className="bg-white border border-zinc-200 text-[#78716C] text-[12px] font-bold px-2.5 py-0.5 rounded-full ml-auto shadow-sm">
                    {colCards.length}
                  </span>
                </div>
                <div className="flex flex-col gap-3 flex-1 overflow-y-auto pb-4 px-1 hide-scrollbar">
                  {colCards.length === 0 ? (
                    <div className="border-2 border-dashed border-[#E7E5E4] rounded-2xl p-6 text-center flex items-center justify-center h-24">
                      <span className="text-[#A8A29E] text-[13px] font-medium">Empty</span>
                    </div>
                  ) : (
                    colCards.map((c) => <KanbanCard key={c.id} card={c} onClick={() => onOpenTask(c)} />)
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function TaskContent({ card }: { card: BoardCard }) {
  return (
    <div className="px-6 py-4">
      <span className={`text-[12px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${statusBadge(card.status)}`}>
        {card.status}
      </span>
      <h1 className="text-[#1C1917] font-black text-[26px] mt-4 leading-tight">{card.name}</h1>

      <div className="mt-8">
        <h3 className="text-[#78716C] text-[13px] font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Expected outcome
        </h3>
        <p className="text-[#1C1917] text-[14.5px] leading-relaxed bg-white border border-zinc-200 shadow-sm p-4 rounded-xl">
          {card.outcome}
        </p>
      </div>

      {card.inReview && (
         <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mt-8 flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-900 font-bold text-[14.5px] mb-1">
              Mentor Review in Progress
            </p>
            <p className="text-amber-800/80 text-[13.5px] leading-relaxed">
              Your mentor is currently reviewing your submission. You will be notified once feedback is provided.
            </p>
          </div>
         </div>
      )}
    </div>
  )
}

function SubmissionForm({ card }: { card: BoardCard }) {
  const { data: blocks, isLoading } = useSubmissionBlocks(card.submissionId)
  const createBlock = useCreateSubmissionBlock()
  const submitSub = useSubmitSubmission()
  const [text, setText] = useState('')

  const handleAddText = () => {
    if (!text.trim() || !card.submissionId) return
    createBlock.mutate({
      submissionId: card.submissionId,
      data: { blockType: 'text', content: text, orderIndex: (blocks?.length || 0) + 1 }
    }, {
      onSuccess: () => setText('')
    })
  }

  const handleSubmit = () => {
    if (!card.submissionId) return
    submitSub.mutate(card.submissionId)
  }

  const canEdit = card.status === 'In Progress'

  return (
    <div className="p-6 border-t border-[#E7E5E4] bg-zinc-50 rounded-t-3xl shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] mt-4">
      <div className="flex items-center mb-5">
        <h3 className="font-extrabold text-[18px] text-[#1C1917]">Your submission</h3>
      </div>

      <div className="space-y-3 mb-6">
        {isLoading ? <Spinner /> : blocks?.map((b) => (
          <div key={b.id} className="bg-white border border-[#E7E5E4] rounded-2xl p-4 shadow-sm">
            {b.blockType === 'text' ? (
              <p className="text-[14.5px] text-[#1C1917] whitespace-pre-wrap leading-relaxed">{b.content}</p>
            ) : (
              <p className="text-[14px] text-blue-600 underline font-medium">Attachment: {b.content}</p>
            )}
          </div>
        ))}
      </div>
      
      {canEdit && (
        <>
          <div className="bg-white border border-[#E7E5E4] rounded-2xl p-3 mb-3 flex flex-col focus-within:border-zinc-400 focus-within:ring-2 focus-within:ring-zinc-400/20 transition-all shadow-sm">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your answer..."
              className="bg-transparent outline-none resize-none text-[#1C1917] text-[14.5px] min-h-[120px] border-none w-full p-1"
            />
            <button 
              onClick={handleAddText}
              disabled={!text.trim() || createBlock.isPending}
              className="self-end mt-2 bg-zinc-900 text-white px-5 py-2.5 rounded-xl text-[13.5px] font-bold disabled:opacity-50 hover:bg-zinc-800 active:scale-95 transition-all"
            >
              {createBlock.isPending ? 'Adding...' : 'Add Block'}
            </button>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={submitSub.isPending || (blocks?.length === 0)}
            className="bg-[#D1E728] text-zinc-900 font-extrabold w-full py-4 rounded-2xl text-[15.5px] mt-2 hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:translate-y-0 shadow-[0_8px_16px_rgba(209,231,40,0.2)]"
          >
            {submitSub.isPending ? 'Submitting...' : 'Submit for review'}
          </button>
        </>
      )}
    </div>
  )
}

export function WorkspacePage() {
  const { id } = useParams<{ id: string }>()

  // API Hooks
  const { data: program, isLoading: progLoading } = useProgram(Number(id))
  const { data: phases } = usePhasesByProgram(Number(id))
  const { data: enrollments } = useMyEnrollments()

  // Find active enrollment for this program
  const activeEnrollment = Array.isArray(enrollments) 
    ? enrollments.find(e => e.programId === Number(id))
    : enrollments?.results?.find((e: any) => e.programId === Number(id))
  
  // Submissions
  const { data: submissions } = useSubmissionsByEnrollment(activeEnrollment?.id)
  
  const [activePhaseIdx, setActivePhaseIdx] = useState(0)
  const activePhase = phases?.[activePhaseIdx]
  
  const { assignmentsByPhase } = useAssignmentsByPhases(activePhase ? [activePhase.id] : [])
  const assignments = activePhase ? assignmentsByPhase[activePhase.id] : []
  const createSubmission = useCreateSubmission()

  const [openCard, setOpenCard] = useState<BoardCard | null>(null)

  if (progLoading) return <div className="flex h-[400px] items-center justify-center"><Spinner /></div>
  if (!program) return <div className="p-10 text-zinc-500 font-medium text-center">Program not found</div>

  // Map assignments to BoardCard
  const boardCards: BoardCard[] = assignments?.map((a: AssignmentResponse) => {
    const sub = submissions?.find(s => s.assigmentId === a.id)
    
    let status: TaskStatus = 'To Do'
    if (sub) {
      if (sub.status === 'draft') status = 'In Progress'
      else if (sub.status === 'submitted') status = 'Review'
      else if (sub.status === 'approved' || sub.status === 'completed') status = 'Done'
    }

    const types = a.allowedTypes.filter((t: string) => ['text', 'image', 'link'].includes(t)) as ('text'|'image'|'link')[]

    return {
      id: a.id,
      name: a.title,
      outcome: a.expectedOutcome || '',
      types,
      status,
      hasFeedback: false,
      inReview: status === 'Review',
      submissionId: sub?.id
    }
  }) || []

  const handleOpenTask = (card: BoardCard) => {
    setOpenCard(card)
  }

  const handleMoveTask = (cardId: number, newStatus: TaskStatus) => {
    const card = boardCards.find(c => c.id === cardId)
    if (!card) return
    if (card.status === newStatus) return

    if (newStatus === 'Review' || newStatus === 'Done') {
      toast.error('Siz hələ taskı tamamlamamısınız. Taskı tamamladıqdan sonra daxilində Submit edə bilərsiniz.')
      return
    }

    if (newStatus === 'To Do') {
      toast.error('Başlanmış taskı "To Do" mərhələsinə qaytarmaq mümkün deyil.')
      return
    }

    // Move to In Progress
    if (newStatus === 'In Progress' && card.status === 'To Do') {
      if (!activeEnrollment) {
        toast.error('Gözlənilməz xəta: Qeydiyyat (Enrollment) tapılmadı.')
        return
      }
      createSubmission.mutate({ assigmentId: card.id, enrollmentId: activeEnrollment.id }, {
        onSuccess: () => {
          toast.success('Task "In Progress" olaraq işarələndi.')
        }
      })
    }
  }

  const progressPercent = activeEnrollment ? Math.round((activeEnrollment.completedPhases / Math.max(phases?.length || 1, 1)) * 100) : 0

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] -mx-4 -mt-4 lg:-mx-8 lg:-mt-8 p-4 lg:p-8">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">{program.title}</h1>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-zinc-500 font-bold text-[14.5px] uppercase tracking-wider">Workspace</span>
            <div className="w-1 h-1 rounded-full bg-zinc-300" />
            <span className="text-zinc-400 font-medium text-[14px]">Taskilled</span>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white border border-zinc-200 px-5 py-3 rounded-[20px] shadow-sm shrink-0">
          <span className="text-zinc-900 font-black text-[16px]">{progressPercent}%</span>
          <div className="w-24 sm:w-32 h-2.5 bg-zinc-100 rounded-full overflow-hidden shrink-0">
            <div className="bg-[#D1E728] h-full transition-all duration-500 rounded-full" style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="text-zinc-500 text-[13.5px] font-bold">Completed</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {phases && phases.length > 0 ? (
          <BoardView 
            phases={phases}
            activePhaseIdx={activePhaseIdx}
            setActivePhaseIdx={setActivePhaseIdx}
            cards={boardCards}
            onOpenTask={handleOpenTask}
            onMoveTask={handleMoveTask}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-500 font-medium bg-zinc-50 rounded-3xl border border-zinc-200">
            Loading phases...
          </div>
        )}
      </div>

      <Sheet
        isOpen={!!openCard}
        onClose={() => setOpenCard(null)}
        title={
          <div className="flex items-center gap-2 text-zinc-900">
            <span className="truncate">Task Details</span>
          </div>
        }
      >
        {openCard && (
          <div className="flex flex-col h-full bg-[#FAFAF5]">
            <div className="flex-1 overflow-y-auto">
              <TaskContent card={openCard} />
            </div>
            <div className="shrink-0 mt-auto">
              {openCard.status === 'To Do' ? (
                <div className="p-6 bg-white border-t border-zinc-200 rounded-t-3xl shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.03)] mt-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
                    <p className="text-amber-900 font-bold text-[15px]">This task has not been started yet.</p>
                    <p className="text-amber-800/80 text-[13.5px] mt-1.5 font-medium">Move it to "In Progress" on the board to begin working.</p>
                  </div>
                </div>
              ) : (
                openCard.submissionId && <SubmissionForm card={openCard} />
              )}
            </div>
          </div>
        )}
      </Sheet>
    </div>
  )
}
