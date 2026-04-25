import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Düzgün email daxil edin'),
  password: z.string().min(6, 'Şifrə minimum 6 simvol olmalıdır'),
})

export type LoginFormData = z.infer<typeof loginSchema>

