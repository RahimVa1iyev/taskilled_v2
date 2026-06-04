import { z } from 'zod'

export const skillSchema = z.object({
  skillId: z.number({ message: 'Bacarıq seçin' }),
  level: z
    .enum(['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert'])
    .optional()
    .nullable(),
})

export type SkillFormData = z.infer<typeof skillSchema>
