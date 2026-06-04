import { Lock } from 'lucide-react'

import { AuthLayout } from '@/modules/auth/components/AuthLayout'
import { useVerifyOtp } from '@/modules/auth/hooks/useVerifyOtp'
import { OTPInput, PrimaryButton } from '@/shared/ui'

export function VerifyPage(): React.JSX.Element {
  const {
    flow,
    email,
    code,
    setCode,
    error,
    isPending,
    canResend,
    resendText,
    onResend,
    onSubmit,
  } = useVerifyOtp()

  return (
    <AuthLayout hideBackLink>

      <div className="mb-4 flex h-[48px] w-[48px] items-center justify-center rounded-[14px] border border-border bg-card">
        <Lock className="h-5 w-5 text-primary" />
      </div>

      <h1 className="text-[16px] font-bold text-foreground">
        {flow === 'forgot-password' ? 'Verify reset code' : 'Verify your email'}
      </h1>
      <p className="mb-4 mt-1 text-[11px] text-muted-foreground">
        Enter the 6-digit code sent to{' '}
        <span className="font-semibold text-foreground">{email || 'your email'}</span>
      </p>

      <OTPInput value={code} onChange={setCode} error={error} />
      {error ? (
        <p className="mt-1 text-center text-[11px] text-destructive">
          Invalid code. Please try again.
        </p>
      ) : null}

      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        {!canResend ? (
          resendText
        ) : (
          <button
            type="button"
            onClick={onResend}
            className="font-semibold text-auth-warn-link"
          >
            Resend code
          </button>
        )}
      </p>

      <div className="mt-6">
        <PrimaryButton onClick={onSubmit} loading={isPending}>
          Verify
        </PrimaryButton>
      </div>
    </AuthLayout>
  )
}
