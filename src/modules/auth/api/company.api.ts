import { api } from '@/shared/lib/axios'
import { COMPANY_ENDPOINTS } from '@/modules/auth/api/company.endpoints'
import type { CompanyProfile } from '@/modules/auth/types/company.types'

export interface CompanyCreateDto {
  name: string
  taxId?: string | null
  contactEmail?: string | null
  contactPhone?: string | null
  country?: number | null
  city?: number | null
  industry?: string | null
  website?: string | null
  description?: string | null
  linkedinUrl?: string | null
  size?: number | null
}

export const companyApi = {
  create: (dto: CompanyCreateDto): Promise<unknown> =>
    api.post(COMPANY_ENDPOINTS.me, dto).then((r) => r.data),

  getMyCompany: (): Promise<CompanyProfile> =>
    api.get(COMPANY_ENDPOINTS.me).then((r) => r.data),
}
