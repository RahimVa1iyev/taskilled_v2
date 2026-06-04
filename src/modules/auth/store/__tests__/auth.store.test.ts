import { useAuthStore } from '../auth.store'

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      refreshToken: null,
      user: null,
      isInitialized: false,
    })
  })

  describe('setAccessToken', () => {
    it('sets accessToken and refreshToken', () => {
      useAuthStore.getState().setAccessToken('token123', 'refresh123')
      expect(useAuthStore.getState().accessToken).toBe('token123')
      expect(useAuthStore.getState().refreshToken).toBe('refresh123')
    })

    it('refreshToken defaults to null if not provided', () => {
      useAuthStore.getState().setAccessToken('token123')
      expect(useAuthStore.getState().refreshToken).toBe(null)
    })
  })

  describe('setUser', () => {
    it('sets user correctly', () => {
      useAuthStore.getState().setUser({ id: 1, email: 'test@test.com', requiredFields: [] } as any)
      expect(useAuthStore.getState().user?.email).toBe('test@test.com')
    })

    it('sets user to null', () => {
      useAuthStore.getState().setUser(null)
      expect(useAuthStore.getState().user).toBe(null)
    })
  })

  describe('setInitialized', () => {
    it('sets isInitialized to true', () => {
      useAuthStore.getState().setInitialized()
      expect(useAuthStore.getState().isInitialized).toBe(true)
    })
  })

  describe('clearAuth', () => {
    it('clears all auth state', () => {
      useAuthStore.getState().setAccessToken('token', 'refresh')
      useAuthStore.getState().setUser({ id: 1 } as any)
      useAuthStore.getState().clearAuth()

      expect(useAuthStore.getState().accessToken).toBe(null)
      expect(useAuthStore.getState().refreshToken).toBe(null)
      expect(useAuthStore.getState().user).toBe(null)
    })
  })
})
