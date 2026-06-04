import { FileUploadContext } from '../context/FileUploadContext'
import { useFileUpload } from '@/shared/hooks/file'
import type { UploadResumeResult } from '@/shared/api/file'

interface FileUploadRootProps {
  accept: string
  maxSizeMb: number
  onSuccess: (result: UploadResumeResult) => void
  onError?: (message: string) => void
  initialFileName?: string | null
  children: React.ReactNode
}

export function FileUploadRoot({
  accept,
  maxSizeMb,
  onSuccess,
  onError,
  initialFileName,
  children,
}: FileUploadRootProps): React.JSX.Element {
  const { isUploading, fileName, error, inputRef, open, clear, onFileSelect } = useFileUpload({
    accept,
    maxSizeMb,
    onSuccess,
    onError,
    initialFileName,
  })

  return (
    <FileUploadContext.Provider
      value={{ isUploading, fileName, error, accept, maxSizeMb, open, clear, onFileSelect }}
    >
      {/* hidden file input — bütün trigger-lər bunu açır */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void onFileSelect(file)
          e.target.value = '' // eyni faylı yenidən seçməyə imkan verir
        }}
      />
      {children}
    </FileUploadContext.Provider>
  )
}
