import { z } from 'zod'

export const linkSchema = z.object({
  url: z.string().url('Düzgün URL daxil edin').min(1, 'URL tələb olunur'),
  linkType: z.string().optional().nullable(),
})

export type LinkFormData = z.infer<typeof linkSchema>
