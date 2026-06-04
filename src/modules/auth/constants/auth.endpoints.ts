import { SERVICES } from '@/shared/constants/services'

export const AUTH_ENDPOINTS = {
  login: `${SERVICES.userManagement}/auth/login`,
  register: `${SERVICES.userManagement}/auth/register`,
  verifyOtp: `${SERVICES.userManagement}/auth/verify-otp`,
  resendOtp: `${SERVICES.userManagement}/auth/resend-otp`,
  forgotPassword: `${SERVICES.userManagement}/auth/forgot-password`,
  resetPassword: `${SERVICES.userManagement}/auth/reset-password`,
  me: `${SERVICES.userManagement}/auth/me`,
} as const
