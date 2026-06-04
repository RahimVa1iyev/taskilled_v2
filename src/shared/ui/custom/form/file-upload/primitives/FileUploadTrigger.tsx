import { useFileUploadContext } from '../context/FileUploadContext'

interface FileUploadTriggerProps {
  children: (ctx: { open: () => void; isUploading: boolean }) => React.ReactNode
}

export function FileUploadTrigger({ children }: FileUploadTriggerProps): React.JSX.Element {
  const { open, isUploading } = useFileUploadContext()
  return <>{children({ open, isUploading })}</>
}
