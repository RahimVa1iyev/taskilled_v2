import axios from 'axios'

import { getTokenProvider } from '@/shared/lib/token-provider'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const token = getTokenProvider().getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

