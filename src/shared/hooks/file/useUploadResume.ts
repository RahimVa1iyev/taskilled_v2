import { useMutation } from '@tanstack/react-query'
import { fileApi } from '@/shared/api/file'
import type { UploadResumeResult } from '@/shared/api/file'

interface UseUploadResumeOptions {
  onSuccess?: (result: UploadResumeResult) => void
  onError?: (error: unknown) => void
}

export function useUploadResume(options?: UseUploadResumeOptions) {
  return useMutation({
    mutationFn: (file: File) => fileApi.uploadResume(file),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  })
}
