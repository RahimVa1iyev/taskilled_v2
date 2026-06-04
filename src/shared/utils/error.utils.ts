export function parseApiError(error: unknown): string {
  // Axios-style error: response body message takes priority over the JS Error message
  if (typeof error === 'object' && error !== null) {
    const responseMessage = (error as { response?: { data?: { message?: unknown } } }).response
      ?.data?.message

    if (typeof responseMessage === 'string') return responseMessage

    if (typeof responseMessage === 'object' && responseMessage !== null) {
      const inner = (responseMessage as { message?: unknown }).message
      if (typeof inner === 'string') return inner
    }
  }

  if (error instanceof Error) return error.message

  if (typeof error === 'string') return error

  return 'Xəta baş verdi'
}
