import { SERVICES } from '@/shared/constants/services'

export const LINKS_ENDPOINTS = {
  userLinks: `${SERVICES.userManagement}/links`,
  deleteUserLink: (linkId: number) => `${SERVICES.userManagement}/links/${linkId}`,
} as const
