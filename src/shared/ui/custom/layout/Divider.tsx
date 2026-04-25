export function Divider(): React.JSX.Element {
  return (
    <div className="my-4 flex items-center gap-2">
      <div className="h-px flex-1 bg-auth-border" />
      <span className="text-[10px] text-auth-placeholder">or</span>
      <div className="h-px flex-1 bg-auth-border" />
    </div>
  )
}

