import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  surname: z.string().min(2, 'Surname must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  agree: z.boolean().refine(Boolean, { message: 'You must accept the terms' }),
})

export type RegisterFormData = z.infer<typeof registerSchema>

