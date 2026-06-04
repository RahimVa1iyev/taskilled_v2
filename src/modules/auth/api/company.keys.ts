export const companyKeys = {
  all: () => ['company'] as const,
  me: () => [...companyKeys.all(), 'me'] as const,
} as const
