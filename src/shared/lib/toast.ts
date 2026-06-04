import { toast as sonnerToast } from 'sonner'

import { parseApiError } from '@/shared/utils/error.utils'

export const toast = {
  success: sonnerToast.success,
  error: sonnerToast.error,
  warning: sonnerToast.warning,
  message: sonnerToast.message,
  info: sonnerToast.info,
  promise: sonnerToast.promise,
  apiError: (error: unknown): string | number => {
    const message = parseApiError(error)
    return sonnerToast.error(message)
  },
  apiSuccess: (response: unknown): void => {
    const message = (response as { message?: unknown } | null)?.message
    if (typeof message !== 'string') return  // object message or missing → silent
    sonnerToast.success(message)
  },
} as const
