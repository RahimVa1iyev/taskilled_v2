import { z } from 'zod'

export const experienceSchema = z.object({
  company: z.string().min(1, 'Şirkət adı tələb olunur').max(100),
  position: z.string().min(1, 'Vəzifə tələb olunur').max(100),
  startDate: z.string().min(1, 'Başlama tarixi tələb olunur'),
  endDate: z.string().optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
})

export type ExperienceFormData = z.infer<typeof experienceSchema>
