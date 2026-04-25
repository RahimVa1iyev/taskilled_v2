import { Outlet } from 'react-router-dom'

export function RootLayout(): React.JSX.Element {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Outlet />
    </div>
  )
}

