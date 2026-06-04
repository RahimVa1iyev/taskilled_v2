import { useProfileQuery } from '@/modules/profile/api/profile.api'
import type { MeResponse } from '@/modules/auth/types/auth.types'

/**
 * Frontend-side completion % calculation.
 *
 * Personal info (firstName + city + bio): 30%
 * Skills (≥1):                            15%
 * Languages (≥1):                         10%
 * Education (≥1):                         15%
 * Experience OR Certificate (≥1):         15%
 * Links (≥1):                             15%
 * Total:                                 100%
 */
export function calculateCompletion(profile: MeResponse): number {
  let pct = 0
  if (profile.firstName && profile.city && profile.bio) pct += 30
  else if (profile.firstName) pct += 10

  if ((profile.skills ?? []).length > 0) pct += 15
  if ((profile.languages ?? []).length > 0) pct += 10
  if ((profile.educations ?? []).length > 0) pct += 15
  if ((profile.experiences ?? []).length > 0 || (profile.certificates ?? []).length > 0) pct += 15

  // Links not on MeResponse — rely on separate query feeding this
  return Math.min(pct, 85) // 85% max without links; links section adds the last 15%
}

export function useProfile() {
  const query = useProfileQuery()
  const profile = query.data

  const completionWithoutLinks = profile ? calculateCompletion(profile) : 0

  return {
    profile,
    isLoading: query.isLoading,
    completionWithoutLinks,
  }
}
