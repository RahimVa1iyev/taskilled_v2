import { create } from 'zustand'
import type { CompanyProfile } from '@/modules/auth/types/company.types'

interface CompanyState {
  company: CompanyProfile | null
  setCompany: (company: CompanyProfile | null) => void
  clearCompany: () => void
}

export const useCompanyStore = create<CompanyState>()((set) => ({
  company: null,
  setCompany: (company) => set({ company }),
  clearCompany: () => set({ company: null }),
}))

export function clearCompany(): void {
  useCompanyStore.getState().clearCompany()
}
