import { CheckCircle, Upload } from 'lucide-react'
import { FileUploadRoot } from './primitives/FileUploadRoot'
import { FileUploadTrigger } from './primitives/FileUploadTrigger'
import { FileUploadPreview } from './primitives/FileUploadPreview'
import { Spinner } from '@/shared/ui/custom/Spinner'
import { cn } from '@/shared/utils/cn'
import type { UploadResumeResult } from '@/shared/api/file'

interface CvUploadProps {
  onSuccess: (result: UploadResumeResult) => void
  onError?: (message: string) => void
  initialFileName?: string | null
  error?: string | null   // form validation xətası (cvStorageUrl)
}

export function CvUpload({
  onSuccess,
  onError,
  initialFileName,
  error: formError,
}: CvUploadProps): React.JSX.Element {
  return (
    <FileUploadRoot
      accept=".pdf,.doc,.docx"
      maxSizeMb={10}
      onSuccess={onSuccess}
      onError={onError}
      initialFileName={initialFileName}
    >
      <FileUploadPreview>
        {({ fileName, error, open, isUploading }) => (
          <>
            {fileName === null ? (
              <FileUploadTrigger>
                {({ open, isUploading }) => (
                  <button
                    type="button"
                    onClick={open}
                    disabled={isUploading}
                    className={cn(
                      'h-[50px] w-full rounded-xl border bg-card px-4 text-[12px] outline-none transition-colors',
                      'flex items-center justify-center gap-2 text-muted-foreground cursor-pointer',
                      formError || error
                        ? 'border-destructive'
                        : 'border-border',
                      isUploading && 'pointer-events-none opacity-60',
                    )}
                  >
                    {isUploading ? (
                      <Spinner className="min-h-0 max-h-[50px] min-w-0 flex-1 py-0 text-[10px]" label="" />
                    ) : (
                      <>
                        <Upload className="h-4 w-4" aria-hidden />
                        Upload file
                      </>
                    )}
                  </button>
                )}
              </FileUploadTrigger>
            ) : (
              <div className="flex items-center justify-between rounded-xl border border-primary bg-card px-4 py-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" aria-hidden />
                  <span className="text-[12px] text-foreground">{fileName}</span>
                </div>
                <button
                  type="button"
                  onClick={open}
                  disabled={isUploading}
                  className="text-[11px] text-muted-foreground underline"
                >
                  Change
                </button>
              </div>
            )}

            {/* upload xətası */}
            {error ? (
              <p className="mt-1 text-[11px] text-destructive" aria-live="polite">{error}</p>
            ) : null}

            {/* form validation xətası */}
            {!error && formError ? (
              <p className="mt-1 text-[11px] text-destructive" aria-live="polite">{formError}</p>
            ) : null}
          </>
        )}
      </FileUploadPreview>
    </FileUploadRoot>
  )
}
