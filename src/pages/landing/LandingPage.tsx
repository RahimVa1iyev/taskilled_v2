import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { ROUTES } from '@/shared/constants/routes'
import { Button } from '@/shared/ui'

export function LandingPage(): React.JSX.Element {
  const { t } = useTranslation('common')

  return (
    <main className="mx-auto flex min-h-dvh max-w-6xl flex-col justify-center gap-6 px-6 py-10">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">{t('landingTitle')}</h1>
        <p className="text-muted-foreground">
          {t('welcome')}
        </p>
      </header>

      <nav className="flex flex-wrap gap-3">
        <Button asChild>
          <Link to={ROUTES.AUTH.LOGIN}>{t('login')}</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to={ROUTES.HOME}>{t('goHome')}</Link>
        </Button>
      </nav>
    </main>
  )
}

