export const onboardingKeys = {
  all: () => ['onboarding'] as const,
  skills: () => [...onboardingKeys.all(), 'skills'] as const,
  interests: () => [...onboardingKeys.all(), 'interests'] as const,
  countries: () => [...onboardingKeys.all(), 'countries'] as const,
  cities: (countryId: number) => [...onboardingKeys.all(), 'cities', countryId] as const,
  roles: () => [...onboardingKeys.all(), 'roles'] as const,
} as const
