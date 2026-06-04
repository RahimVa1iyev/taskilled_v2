import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Modal } from '@/shared/ui/custom/Modal'
import { CvUpload } from '@/shared/ui/custom/form/file-upload/CvUpload'
import { Spinner } from '@/shared/ui/custom/Spinner'
import { useCreateEnrollment } from '@/modules/business-simulation/api/enrollment.api'
import { authApi } from '@/modules/auth/api/auth.api'
import { authKeys } from '@/modules/auth/api/auth.keys'
import { useMe } from '@/modules/auth/api/queries/useMe'
import { FileText, Link as LinkIcon, CheckCircle } from 'lucide-react'
import { toast } from '@/shared/lib/toast'
import type { UploadResumeResult } from '@/shared/api/file'

import type { EnrollmentResponse } from '@/modules/business-simulation/types/program.types'

interface EnrollmentModalProps {
  isOpen: boolean
  onClose: () => void
  programId: number
  programTitle: string
  onSuccess: (data: EnrollmentResponse) => void
}

export function EnrollmentModal({
  isOpen,
  onClose,
  programId,
  programTitle,
  onSuccess
}: EnrollmentModalProps) {
  const { data: user } = useMe()
  const queryClient = useQueryClient()
  
  const [motivationLetter, setMotivationLetter] = useState('')
  const [cvUrl, setCvUrl] = useState<string | null>(user?.cvUrl || null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const createEnrollment = useCreateEnrollment()

  const updateProfile = useMutation({
    mutationFn: authApi.updateMe,
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.me(), data)
    }
  })

  const handleCvUploadSuccess = (result: UploadResumeResult) => {
    setCvUrl(result.storageUrl)
    setUploadError(null)
    // Update user profile immediately as requested
    updateProfile.mutate({ cvUrl: result.storageUrl })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!cvUrl) {
      toast.error('Please upload or select your CV to continue.')
      return
    }

    createEnrollment.mutate(
      { 
        programId,
        motivationLetter: motivationLetter || undefined,
        cvUrl: cvUrl
      },
      {
        onSuccess: (data) => {
          onSuccess(data)
        },
        onError: (err: any) => {
          console.error(err)
          toast.error('Error during enrollment. Please try again.')
        }
      }
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Join ${programTitle}`}
      description="Tell us why you want to join this program and share your CV."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* CV Section */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-semibold text-zinc-800 dark:text-zinc-200">
            Your Resume / CV
          </label>
          
          {cvUrl ? (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-zinc-900 dark:text-zinc-100">
                    CV attached from your profile
                  </p>
                  <a href={cvUrl} target="_blank" rel="noreferrer" className="text-[12.5px] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 flex items-center gap-1 mt-0.5">
                    <LinkIcon className="w-3 h-3" /> View Document
                  </a>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => setCvUrl(null)}
                className="text-[13px] text-zinc-500 hover:text-red-500 font-medium px-3 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Remove
              </button>
            </div>
          ) : (
            <div>
              <CvUpload 
                onSuccess={handleCvUploadSuccess}
                onError={(err) => setUploadError(err)}
                error={uploadError}
              />
              <p className="text-[12px] text-zinc-500 mt-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Accepted formats: PDF, DOC, DOCX (Max 10MB)
              </p>
            </div>
          )}
        </div>

        {/* Motivation Letter Section */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-semibold text-zinc-800 dark:text-zinc-200 flex items-center justify-between">
            Motivation Letter
            <span className="text-zinc-400 font-normal text-[12px]">Optional</span>
          </label>
          <textarea
            value={motivationLetter}
            onChange={(e) => setMotivationLetter(e.target.value)}
            placeholder="Why are you interested in this program? What do you hope to achieve?"
            className="w-full min-h-[120px] p-4 text-[14px] rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-[--color-brand] focus:ring-1 focus:ring-[--color-brand] transition-all resize-none placeholder:text-zinc-400"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 rounded-xl text-[14.5px] font-semibold text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={createEnrollment.isPending}
            className="flex-1 py-3.5 rounded-xl text-[14.5px] font-bold text-white bg-zinc-900 hover:bg-zinc-800 dark:text-zinc-900 dark:bg-zinc-100 dark:hover:bg-zinc-200 transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {createEnrollment.isPending ? (
              <Spinner className="h-5 w-5 !border-[2px]" />
            ) : (
              'Complete Enrollment'
            )}
          </button>
        </div>

      </form>
    </Modal>
  )
}
