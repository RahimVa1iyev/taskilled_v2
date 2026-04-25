import { useMutation } from '@tanstack/react-query'

import { authApi } from '@/modules/auth/api/auth.api'
import type { LoginDto } from '@/modules/auth/types/auth.types'

export function useLogin() {
  return useMutation({
    mutationFn: (dto: LoginDto) => authApi.login(dto),
  })
}

