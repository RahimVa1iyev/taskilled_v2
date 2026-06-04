import { createContext, useContext } from 'react'

export interface FileUploadContextValue {
  isUploading: boolean
  fileName: string | null
  error: string | null
  accept: string
  maxSizeMb: number
  open: () => void
  clear: () => void
  onFileSelect: (file: File) => Promise<void>
}

export const FileUploadContext = createContext<FileUploadContextValue | null>(null)

export function useFileUploadContext(): FileUploadContextValue {
  const ctx = useContext(FileUploadContext)
  if (!ctx) throw new Error('useFileUploadContext must be used within FileUploadRoot')
  return ctx
}
