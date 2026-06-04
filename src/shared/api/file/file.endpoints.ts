import { SERVICES } from '@/shared/constants/services'

export const FILE_ENDPOINTS = {
  uploadResume: `${SERVICES.fileMicroservice}/file/upload/resume`,
} as const
