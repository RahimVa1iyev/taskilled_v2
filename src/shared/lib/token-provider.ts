export interface TokenProvider {
  getToken: () => string | null
}

let tokenProvider: TokenProvider = { getToken: () => null }

export function registerTokenProvider(provider: TokenProvider): void {
  tokenProvider = provider
}

export function getTokenProvider(): TokenProvider {
  return tokenProvider
}

