import { toast as sonnerToast } from 'sonner'

import { parseApiError } from '@/shared/utils/error.utils'

export const toast = {
  success: sonnerToast.success,
  error: sonnerToast.error,
  message: sonnerToast.message,
  promise: sonnerToast.promise,
  apiError: (error: unknown): string | number => {
    const message = parseApiError(error)
    return sonnerToast.error(message)
  },
} as const

