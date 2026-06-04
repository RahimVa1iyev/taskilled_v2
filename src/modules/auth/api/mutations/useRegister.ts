import { useMutation } from '@tanstack/react-query'

import { authApi } from '@/modules/auth/api/auth.api'
import type { RegisterDto } from '@/modules/auth/types/auth.types'

export function useRegister() {
  return useMutation({
    mutationFn: (dto: RegisterDto) => authApi.register(dto),
  })
}
