export const ROUTES = {
  ROOT: '/',
  AUTH: {
    ROOT: '/auth',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY: '/auth/verify',
    ROLE: '/auth/role',
    ONBOARDING: '/auth/onboarding',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  APP: {
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    EXPLORE: '/explore',       // disabled — gələcək
    PROGRAMS: '/programs',     // My Programs list
    PROGRAM_DETAIL: (id: number) => `/programs/${id}`,
    COURSES: '/courses',       // disabled — gələcək
    HACKATHONS: '/hackathons', // disabled — gələcək
    COMMUNITY: '/community',   // disabled — gələcək
  },
  PUBLIC_PROFILE: (username: string) => `/u/${username}`,
} as const
