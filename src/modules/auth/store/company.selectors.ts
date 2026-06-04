import { useCompanyStore } from './company.store'

export const useCompany = () => useCompanyStore((s) => s.company)
export const useIsCompanyLoaded = () => useCompanyStore((s) => s.company !== null)
