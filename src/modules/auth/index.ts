export { clearAuth, setInitialized, useAuthStore } from './store/auth.store'
export {
  useIsAuthenticated,
  useAccessToken,
  useUser,
  useIsInitialized,
  useRequiredFields,
  useUserRole,
} from './store/auth.selectors'

export { loginSchema } from './types/auth.schema'
export type { LoginFormData } from './types/auth.schema'
export { otpSchema } from './types/otp.schema'
export type { OtpFormData } from './types/otp.schema'
export { registerSchema } from './types/register.schema'
export type { RegisterFormData } from './types/register.schema'
export type { ForgotPasswordFormData } from './types/forgot-password.schema'
export type { ResetPasswordFormData } from './types/reset-password.schema'

export type {
  OtpFlow,
  AuthTokens,
  AuthResponse,
  OtpVerifyResponse,
  OtpVerifyDto,
  ResendOtpDto,
  ResendOtpResponse,
  LoginDto,
  RegisterDto,
  RegisterResponse,
  UserProfile,
  UserUpdateDto,
  MeResponse,
  ForgotPasswordDto,
  ForgotPasswordResponse,
  ResetPasswordDto,
  ResetPasswordResponse,
  RoleResponse,
  InterestResponse,
  SkillResponse,
  CityResponse,
  CountryResponse,
} from './types/auth.types'

export { authApi } from './api/auth.api'
export { authKeys } from './api/auth.keys'
export { useMe } from './api/queries/useMe'
export { useLogin } from './api/mutations/useLogin'
export { useRegister } from './api/mutations/useRegister'
export { useVerifyOtp as useVerifyOtpMutation } from './api/mutations/useVerifyOtp'
export { useResendOtp } from './api/mutations/useResendOtp'
export { useForgotPassword } from './api/mutations/useForgotPassword'
export { useResetPassword } from './api/mutations/useResetPassword'


export { AuthLayout } from './components/AuthLayout'
export { AuthLeftPanel } from './components/AuthLeftPanel'
export { LogoPill } from './components/LogoPill'
export { BackButton } from './components/BackButton'

// Company
export type { CompanyProfile, CompanyResponse } from './types/company.types'
export { companyApi } from './api/company.api'
export { companyKeys } from './api/company.keys'
export { useCompanyStore, clearCompany } from './store/company.store'
export { useCompany, useIsCompanyLoaded } from './store/company.selectors'
