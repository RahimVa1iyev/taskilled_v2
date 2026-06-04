import { Link, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'

import { useIsAuthenticated, useUser } from '@/modules/auth'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { ROUTES } from '@/shared/constants/routes'
import { Button } from '@/shared/ui'
import { cn } from '@/shared/utils/cn'

function getInitials(firstName?: string | null, lastName?: string | null): string {
  const a = (firstName?.trim().at(0) ?? '').toUpperCase()
  const b = (lastName?.trim().at(0) ?? '').toUpperCase()
  return (a + b) || 'U'
}

export function Header(): React.JSX.Element {
  const isAuthenticated = useIsAuthenticated()
  const user = useUser()
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const navigate = useNavigate()

  const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : ''
  const initials = getInitials(user?.firstName, user?.lastName)

  function handleLogout() {
    clearAuth()
    navigate(ROUTES.ROOT)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link to={ROUTES.ROOT} className="text-sm font-bold text-foreground">
          Taskilled
        </Link>

        {!isAuthenticated ? (
          <nav className="flex items-center gap-2" aria-label="Auth actions">
            <Button variant="outline" asChild>
              <Link to={ROUTES.AUTH.LOGIN}>Giriş</Link>
            </Button>
            <Button asChild>
              <Link to={ROUTES.AUTH.REGISTER}>Qeydiyyat</Link>
            </Button>
          </nav>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">{fullName}</span>
            <div className="h-9 w-9 overflow-hidden rounded-full border border-border bg-muted">
              {user?.imgUrl ? (
                <img
                  src={user.imgUrl}
                  alt={fullName ? `${fullName} profil şəkli` : 'Profil şəkli'}
                  className="h-full w-full object-cover"
                  width={36}
                  height={36}
                  loading="lazy"
                />
              ) : (
                <div
                  className={cn(
                    'flex h-full w-full items-center justify-center text-xs font-semibold text-muted-foreground',
                  )}
                  aria-label="Profil avatarı"
                >
                  {initials}
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              aria-label="Çıxış"
              className="h-9 w-9 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut size={16} />
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}

