import { useEffect, useMemo, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'

import { useVerifyOtp as useVerifyOtpMutation } from '@/modules/auth/api/mutations/useVerifyOtp'
import { useResendOtp } from '@/modules/auth/api/mutations/useResendOtp'
import type { OtpFlow } from '@/modules/auth/types/auth.types'
import { ROUTES } from '@/shared/constants/routes'
import { toast } from '@/shared/lib/toast'

interface OtpState {
  flow: OtpFlow
  email: string
}

function isOtpState(value: unknown): value is OtpState {
  if (!value || typeof value !== 'object') return false
  const v = value as { flow?: unknown; email?: unknown }
  return (
    (v.flow === 'register' || v.flow === 'login' || v.flow === 'forgot-password') &&
    typeof v.email === 'string'
  )
}

interface UseVerifyOtpResult {
  flow: OtpFlow
  email: string
  code: string[]
  setCode: (v: string[]) => void
  error: boolean
  isPending: boolean
  seconds: number
  resendText: string
  canResend: boolean
  onResend: () => void
  onSubmit: () => void
}

export function useVerifyOtp(): UseVerifyOtpResult {
  const navigate = useNavigate()
  const location = useLocation()

  const state = isOtpState(location.state) ? location.state : null

  useEffect(() => {
    if (!state) navigate(ROUTES.AUTH.LOGIN, { replace: true })
  }, [state, navigate])

  const { flow, email } = state ?? { flow: 'register' as OtpFlow, email: '' }

  const [code, setCode] = useState<string[]>(['', '', '', '', '', ''])
  const [error, setError] = useState(false)
  const [seconds, setSeconds] = useState(60)

  const isMountedRef = useRef(true)
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const { mutateAsync: verifyOtp, isPending: isVerifyPending } = useVerifyOtpMutation()
  const { mutateAsync: resendOtp, isPending: isResendPending } = useResendOtp()

  useEffect(() => {
    if (seconds <= 0) return
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds])

  async function onResend(): Promise<void> {
    try {
      await resendOtp({ email })
      if (isMountedRef.current) setSeconds(60)
    } catch {
      // mutation's onError (global handler) shows toast
    }
  }

  async function onSubmit(): Promise<void> {
    const joined = code.join('')
    if (joined.length < 6) {
      setError(true)
      setTimeout(() => {
        if (isMountedRef.current) setError(false)
      }, 500)
      return
    }

    try {
      await verifyOtp({ email, otp: Number(joined), flow })
    } catch (error) {
      if (!isMountedRef.current) return

      const msg = isAxiosError(error)
        ? (error.response?.data as { message?: unknown } | undefined)?.message
        : undefined

      const isBlocked =
        typeof msg === 'object' &&
        msg !== null &&
        'errorCode' in (msg as object)

      if (isBlocked) {
        setCode(['', '', '', '', '', ''])
        setSeconds(60)
        try {
          await resendOtp({ email })
          toast.warning('Too many wrong attempts. A new code has been sent.')
        } catch {
          // resendOtp error toast handled by mutation
        }
        return
      }

      setError(true)
      setTimeout(() => {
        if (isMountedRef.current) setError(false)
      }, 500)
      toast.apiError(error)
    }
  }

  const resendText = useMemo(() => {
    const mm = Math.floor(seconds / 60)
    const ss = String(seconds % 60).padStart(2, '0')
    return `Resend code in ${mm}:${ss}`
  }, [seconds])

  return {
    flow,
    email,
    code,
    setCode,
    error,
    isPending: isVerifyPending || isResendPending,
    seconds,
    resendText,
    canResend: seconds <= 0,
    onResend,
    onSubmit,
  }
}
