import axios from 'axios'

import { getTokenProvider } from '@/shared/lib/token-provider'
import { objectToCamelCase, objectToSnakeCase } from '@/shared/utils/case.utils'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const token = getTokenProvider().getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`

  if (config.data !== undefined && !(config.data instanceof FormData)) {
    config.data = objectToSnakeCase(config.data)
  }

  return config
})

api.interceptors.response.use(
  (response) => {
    response.data = objectToCamelCase(response.data)
    return response
  },
  (error: unknown) => {
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof (error as { response?: unknown }).response === 'object' &&
      (error as { response: { data?: unknown } }).response !== null
    ) {
      const err = error as { response: { data?: unknown } }
      err.response.data = objectToCamelCase(err.response.data)
    }
    return Promise.reject(error)
  },
)

