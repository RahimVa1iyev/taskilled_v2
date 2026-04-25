import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { ROUTES } from '@/shared/constants/routes'

type VerifyReason = 'emailVerify' | 'passwordReset'

interface VerifyState {
  reason: VerifyReason
  email?: string
}

export type { VerifyReason, VerifyState }

function isVerifyState(value: unknown): value is VerifyState {
  if (!value || typeof value !== 'object') return false
  const v = value as { reason?: unknown; email?: unknown }
  return (
    (v.reason === 'emailVerify' || v.reason === 'passwordReset') &&
    (v.email === undefined || typeof v.email === 'string')
  )
}

interface UseVerifyOtpResult {
  reason: VerifyReason
  email?: string
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

  const state = isVerifyState(location.state) ? location.state : { reason: 'emailVerify' as const }
  const { reason, email } = state

  const [code, setCode] = useState<string[]>(['', '', '', '', '', ''])
  const [error, setError] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [seconds, setSeconds] = useState(60)

  useEffect(() => {
    if (seconds <= 0) return
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds])

  function onResend(): void {
    setSeconds(60)
  }

  function onSubmit(): void {
    setIsPending(true)
    setTimeout(() => {
      const ok = code.every((d) => d.length === 1)
      if (!ok) {
        setError(true)
        setIsPending(false)
        setTimeout(() => setError(false), 500)
        return
      }

      setIsPending(false)
      navigate(reason === 'emailVerify' ? ROUTES.AUTH.ROLE : ROUTES.AUTH.RESET_PASSWORD)
    }, 700)
  }

  const resendText = useMemo(() => {
    const mm = Math.floor(seconds / 60)
    const ss = String(seconds % 60).padStart(2, '0')
    return `Resend code in ${mm}:${ss}`
  }, [seconds])

  return {
    reason,
    email,
    code,
    setCode,
    error,
    isPending,
    seconds,
    resendText,
    canResend: seconds <= 0,
    onResend,
    onSubmit,
  }
}

