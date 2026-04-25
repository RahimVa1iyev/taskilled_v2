import type { ApiResponse } from '@/shared/types/api.types'
import { api } from '@/shared/lib/axios'
import type {
  AuthTokens,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from '@/modules/auth/types/auth.types'

export const authApi = {
  login: (dto: LoginDto): Promise<ApiResponse<AuthTokens>> =>
    api.post('/auth/login', dto).then((r) => r.data),

  register: (dto: RegisterDto): Promise<ApiResponse<AuthTokens>> =>
    api.post('/auth/register', dto).then((r) => r.data),

  forgotPassword: (dto: ForgotPasswordDto): Promise<ApiResponse<{ ok: true }>> =>
    api.post('/auth/forgot-password', dto).then((r) => r.data),

  resetPassword: (dto: ResetPasswordDto): Promise<ApiResponse<{ ok: true }>> =>
    api.post('/auth/reset-password', dto).then((r) => r.data),

  me: (): Promise<ApiResponse<{ id: string; email: string }>> =>
    api.get('/auth/me').then((r) => r.data),
}

