export interface CompanyProfile {
  id: number
  name: string
  taxId: string | null
  description: string | null
  contactEmail: string | null
  contactPhone: string | null
  country: {
    id: number
    name: string
  } | null
  city: {
    id: number
    name: string
    countryId: number
  } | null
  industry: string | null
  size: string | null
  website: string | null
  logoUrl: string | null
  linkedinUrl: string | null
  isVerified: boolean
  ratingCount: number
  createdAt: string
  updatedAt: string | null
}

export type CompanyResponse = CompanyProfile
