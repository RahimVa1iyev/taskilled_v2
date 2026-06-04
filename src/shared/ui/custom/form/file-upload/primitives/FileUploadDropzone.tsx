
interface FileUploadDropzoneProps {
  children: React.ReactNode
  className?: string
}

export function FileUploadDropzone({
  children,
  className,
}: FileUploadDropzoneProps): React.JSX.Element {

  // TODO: drag & drop event-ləri əlavə ediləcek
  return (
    <div className={className}>
      {children}
    </div>
  )
}
