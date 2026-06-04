import { Outlet } from 'react-router-dom'
import { AppHeader } from '@/shared/ui/AppHeader'
import { AppFooter } from '@/shared/ui/AppFooter'

export function RootLayout(): React.JSX.Element {
  return (
    <>
      <AppHeader />
      <main style={{ paddingTop: '88px', minHeight: '100vh' }}>
        <Outlet />
      </main>
      <AppFooter />
    </>
  )
}
