import { api } from '@/shared/lib/axios'
import { AUTH_ENDPOINTS } from '@/modules/auth/constants/auth.endpoints'
import type {
  AuthResponse,
  ForgotPasswordDto,
  ForgotPasswordResponse,
  LoginDto,
  MeResponse,
  OtpVerifyDto,
  OtpVerifyResponse,
  RegisterDto,
  RegisterResponse,
  ResendOtpDto,
  ResendOtpResponse,
  ResetPasswordDto,
  ResetPasswordResponse,
  UserUpdateDto,
} from '@/modules/auth/types/auth.types'

export const authApi = {
  login: (dto: LoginDto): Promise<AuthResponse> =>
    api.post(AUTH_ENDPOINTS.login, dto).then((r) => r.data),

  register: (dto: RegisterDto): Promise<RegisterResponse> =>
    api
      .post(AUTH_ENDPOINTS.register, { ...dto, repeatPassword: dto.password })
      .then((r) => r.data),

  verifyOtp: (dto: OtpVerifyDto): Promise<OtpVerifyResponse> =>
    api.post(AUTH_ENDPOINTS.verifyOtp, dto).then((r) => r.data),

  resendOtp: (dto: ResendOtpDto): Promise<ResendOtpResponse> =>
    api.post(AUTH_ENDPOINTS.resendOtp, dto).then((r) => r.data),

  forgotPassword: (dto: ForgotPasswordDto): Promise<ForgotPasswordResponse> =>
    api.post(AUTH_ENDPOINTS.forgotPassword, dto).then((r) => r.data),

  // token is the temporary token from verify-otp — NOT the global auth store token.
  // Passed as a one-off header so the global interceptor (which has no stored token
  // at this point in the reset flow) does not override it.
  resetPassword: (token: string, dto: ResetPasswordDto): Promise<ResetPasswordResponse> =>
    api
      .post(AUTH_ENDPOINTS.resetPassword, dto, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => r.data),

  me: (): Promise<MeResponse> => api.get(AUTH_ENDPOINTS.me).then((r) => r.data),

  updateMe: (dto: UserUpdateDto): Promise<MeResponse> =>
    api.put(AUTH_ENDPOINTS.me, dto).then((r) => r.data),
}
