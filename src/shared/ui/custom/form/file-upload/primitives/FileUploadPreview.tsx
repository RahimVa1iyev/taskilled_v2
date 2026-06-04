import { useFileUploadContext } from '../context/FileUploadContext'

interface FileUploadPreviewProps {
  children: (ctx: {
    fileName: string | null
    error: string | null
    clear: () => void
    open: () => void
    isUploading: boolean
  }) => React.ReactNode
}

export function FileUploadPreview({ children }: FileUploadPreviewProps): React.JSX.Element {
  const { fileName, error, clear, open, isUploading } = useFileUploadContext()
  return <>{children({ fileName, error, clear, open, isUploading })}</>
}
