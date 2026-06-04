import { z } from 'zod'

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, 'Enter the 6-digit code')
    .regex(/^\d{6}$/, 'OTP must be 6 digits')
    .transform(Number),
})

export type OtpFormData = z.infer<typeof otpSchema>
