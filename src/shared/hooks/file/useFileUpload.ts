import { useState, useRef } from 'react'
import { useUploadResume } from '@/shared/hooks/file/useUploadResume'
import type { UploadResumeResult } from '@/shared/api/file'

interface UseFileUploadOptions {
  accept: string
  maxSizeMb: number
  onSuccess: (result: UploadResumeResult) => void
  onError?: (message: string) => void
  initialFileName?: string | null
}

interface UseFileUploadResult {
  isUploading: boolean
  fileName: string | null
  error: string | null
  inputRef: React.RefObject<HTMLInputElement | null>
  open: () => void
  clear: () => void
  onFileSelect: (file: File) => Promise<void>
}

export function useFileUpload({
  accept,
  maxSizeMb,
  onSuccess,
  onError,
  initialFileName = null,
}: UseFileUploadOptions): UseFileUploadResult {
  const [fileName, setFileName] = useState<string | null>(initialFileName || null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { mutateAsync: uploadResume, isPending: isUploading } = useUploadResume()

  function open(): void {
    inputRef.current?.click()
  }

  function clear(): void {
    setFileName(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  async function onFileSelect(file: File): Promise<void> {
    setError(null)

    // format yoxla
    const ext = '.' + file.name.split('.').pop()?.toLowerCase()
    const acceptedExts = accept.split(',').map((a) => a.trim().toLowerCase())
    if (!acceptedExts.includes(ext)) {
      const msg = `Yalnız ${accept} formatı qəbul edilir`
      setError(msg)
      onError?.(msg)
      return
    }

    // ölçü yoxla
    const sizeMb = file.size / (1024 * 1024)
    if (sizeMb > maxSizeMb) {
      const msg = `Fayl ${maxSizeMb}MB-dan böyük ola bilməz`
      setError(msg)
      onError?.(msg)
      return
    }

    try {
      const result = await uploadResume(file)
      setFileName(file.name)
      onSuccess(result)
    } catch {
      const msg = 'Fayl yüklənərkən xəta baş verdi'
      setError(msg)
      onError?.(msg)
    }
  }

  return { isUploading, fileName, error, inputRef, open, clear, onFileSelect }
}
