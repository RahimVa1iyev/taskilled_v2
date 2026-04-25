import * as React from 'react'

import { Button } from '@/shared/ui'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: (error: Error) => React.ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error): void {
    // eslint-disable-next-line no-console
    console.error(error)
  }

  render(): React.ReactNode {
    const { error } = this.state
    const { children, fallback } = this.props

    if (!error) return children
    if (fallback) return fallback(error)

    return (
      <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-4 px-6 py-10">
        <h1 className="text-2xl font-semibold">Xəta baş verdi</h1>
        <p className="text-muted-foreground">{error.message}</p>
        <div>
          <Button
            type="button"
            onClick={() => this.setState({ error: null })}
          >
            Yenidən yoxla
          </Button>
        </div>
      </main>
    )
  }
}

