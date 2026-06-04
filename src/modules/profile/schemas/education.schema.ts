import { z } from 'zod'

export const educationSchema = z.object({
  schoolName: z.string().min(1, 'Məktəb adı tələb olunur').max(150),
  degree: z.string().max(100).optional().nullable(),
  fieldOfStudy: z.string().max(100).optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
})

export type EducationFormData = z.infer<typeof educationSchema>
