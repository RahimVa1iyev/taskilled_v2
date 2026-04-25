import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom'

import { ROUTES } from '@/shared/constants/routes'
import { Button } from '@/shared/ui'

export function RouteErrorPage(): React.JSX.Element {
  const error = useRouteError()

  const title = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'Xəta baş verdi'

  const description = isRouteErrorResponse(error)
    ? error.data?.message ?? 'Səhifə yüklənmədi'
    : error instanceof Error
      ? error.message
      : 'Gözlənilməz xəta'

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-4 px-6 py-10">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link to={ROUTES.ROOT}>Landing</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to={ROUTES.AUTH.LOGIN}>Login</Link>
        </Button>
      </div>
    </main>
  )
}

