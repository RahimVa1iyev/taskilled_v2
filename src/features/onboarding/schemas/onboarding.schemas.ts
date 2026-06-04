import { z } from 'zod'

const linkedinUrlSchema = z
  .string()
  .url('Please enter a valid URL')
  .includes('linkedin.com', { message: 'Must be a LinkedIn URL' })

const linkedinUrlOptionalSchema = linkedinUrlSchema
  .optional()
  .or(z.literal(''))

export const internStep1Schema = z.object({
  cityId: z.number({ message: 'Please select your city' }).min(1, 'Please select your city'),
  interestIds: z.array(z.number()).min(1, 'Please select at least one interest'),
  skillIds: z.array(z.number()),
  areasOfInterest: z.string(),
})

export const mentorStep1Schema = z.object({
  bio: z.string()
    .min(50, 'Bio must be at least 50 characters')
    .max(500, 'Bio must be at most 500 characters'),
  specialization: z.string()
    .min(2, 'Specialization must be at least 2 characters')
    .max(100, 'Specialization is too long'),
})

export const mentorStep2Schema = z.object({
  skillIds: z.array(z.number()).min(1, 'Please select at least one skill'),
})

export const mentorStep3Schema = z.object({
  linkedinUrl: linkedinUrlSchema,
  cvStorageUrl: z.string({ message: 'Please upload your CV' }).min(1, 'Please upload your CV'),
  cvFileName: z.string().min(1, 'Please upload your CV'),
})

export const partnerStep1Schema = z.object({
  name: z.string().min(2, 'Company name is required'),
  taxId: z.string().min(1, 'Tax ID is required'),
  contactEmail: z.string().email('Please enter a valid email'),
  contactPhone: z.string()
    .min(7, 'Phone number is too short')
    .regex(/^\+/, 'Phone must start with country code e.g. +994'),
  countryId: z.number({ message: 'Please select a country' }).min(1, 'Please select a country'),
  cityId: z.number({ message: 'Please select a city' }).min(1, 'Please select a city'),
  industry: z.string().min(2, 'Industry must be at least 2 characters'),
})

export const partnerStep2Schema = z.object({
  description: z.string().max(500, 'Description must be at most 500 characters').optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  linkedinUrl: linkedinUrlOptionalSchema,
  size: z.string().optional(),
})
