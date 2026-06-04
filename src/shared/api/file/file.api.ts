import { api } from '@/shared/lib/axios'
import { FILE_ENDPOINTS } from './file.endpoints'
import type { UploadResumeResponse, UploadResumeResult } from './file.types'

export const fileApi = {
  uploadResume: async (file: File): Promise<UploadResumeResult> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post<UploadResumeResponse>(
      FILE_ENDPOINTS.uploadResume,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        transformRequest: (data: unknown) => data,
      },
    )

    if (!response.data.success || !response.data.filePath) {
      throw new Error('File upload failed: server returned no file_path')
    }

    return {
      filePath: response.data.filePath,       // relative path → sent to API
      storageUrl: response.data.storageUrl,   // full URL → available for UI
    }
  },
}
