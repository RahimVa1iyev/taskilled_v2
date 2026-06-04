import { z } from 'zod'

export const languageSchema = z.object({
  language: z.string({ message: 'Dil seçin' }).min(1, 'Dil seçin'),
  level: z.string().min(1, 'Səviyyə seçin'),
})

export type LanguageFormData = z.infer<typeof languageSchema>
