import { useTranslation } from 'react-i18next'

export function HomePage(): React.JSX.Element {
  const { t } = useTranslation('common')

  return (
    <main className="mx-auto flex min-h-dvh max-w-6xl flex-col justify-center gap-4 px-6 py-10">
      <h1 className="text-3xl font-semibold text-foreground">{t('welcome')}</h1>
      <p className="text-muted-foreground">
        Home page (auth-required) skeleti hazırdır.
      </p>
    </main>
  )
}

