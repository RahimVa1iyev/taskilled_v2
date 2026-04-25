export function parseApiError(error: unknown): string {
  if (error instanceof Error) return error.message

  if (typeof error === 'string') return error

  if (typeof error === 'object' && error) {
    const maybeMessage = (error as { message?: unknown }).message
    if (typeof maybeMessage === 'string') return maybeMessage
  }

  return 'Xəta baş verdi'
}

