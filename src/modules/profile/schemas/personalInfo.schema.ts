import { z } from 'zod'

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'Ad tələb olunur').max(50),
  lastName: z.string().min(1, 'Soyad tələb olunur').max(50),
  bio: z.string().max(500, 'Bio 500 simvoldan çox ola bilməz').optional().nullable(),
  areasOfInterest: z.string().max(100, 'Max 100 simvol').optional().nullable(),
  birthDate: z.string().optional().nullable(),
  gender: z.enum(['Male', 'Female']).optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  webSite: z.string().url('Düzgün URL daxil edin').optional().nullable().or(z.literal('')),
  countryId: z.number().optional().nullable(),
  cityId: z.number().optional().nullable(),
})

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>
