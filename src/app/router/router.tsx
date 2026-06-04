import { lazy, Suspense } from 'react'
import { createBrowserRouter, Outlet } from 'react-router-dom'

import { useMe } from '@/modules/auth/api/queries/useMe'
import { useCompany } from '@/modules/auth/api/queries/useCompany'
import { AuthLayout } from '@/app/layouts/AuthLayout'
import { AppLayout } from '@/app/layouts/AppLayout'
import { RootLayout } from '@/app/layouts/RootLayout'
import { AuthGuard } from '@/app/router/guards/AuthGuard'
import { GuestGuard } from '@/app/router/guards/GuestGuard'
import { OnboardingGuard } from '@/app/router/guards/OnboardingGuard'
import { ROUTES } from '@/shared/constants/routes'
import { ErrorBoundary } from '@/shared/ui/custom/ErrorBoundary'
import { RouteErrorPage } from '@/shared/ui/custom/RouteErrorPage'
import { Spinner } from '@/shared/ui/custom/Spinner'

// ── Lazy pages ────────────────────────────────────────────────────────────────

const LandingPage = lazy(async () => ({
  default: (await import('@/pages/landing/LandingPage')).LandingPage,
}))
const LoginPage = lazy(async () => ({
  default: (await import('@/modules/auth/pages/LoginPage')).LoginPage,
}))
const RegisterPage = lazy(async () => ({
  default: (await import('@/modules/auth/pages/RegisterPage')).RegisterPage,
}))
const VerifyPage = lazy(async () => ({
  default: (await import('@/modules/auth/pages/VerifyPage')).VerifyPage,
}))
const RolePage = lazy(async () => ({
  default: (await import('@/modules/auth/pages/RolePage')).RolePage,
}))
const OnboardingPage = lazy(async () => ({
  default: (await import('@/modules/auth/pages/OnboardingPage')).OnboardingPage,
}))
const ForgotPasswordPage = lazy(async () => ({
  default: (await import('@/modules/auth/pages/ForgotPasswordPage')).ForgotPasswordPage,
}))
const ResetPasswordPage = lazy(async () => ({
  default: (await import('@/modules/auth/pages/ResetPasswordPage')).ResetPasswordPage,
}))

// ── App pages ─────────────────────────────────────────────────────────────────

const DashboardPage = lazy(async () => ({
  default: (await import('@/pages/dashboard/DashboardPage')).DashboardPage,
}))
const ProfilePage = lazy(async () => ({
  default: (await import('@/modules/profile/ProfilePage')).ProfilePage,
}))
const ProgramsLibraryPage = lazy(async () => ({
  default: (await import('@/modules/business-simulation/pages/ProgramsLibraryPage')).ProgramsLibraryPage,
}))
const ProgramDetailPage = lazy(async () => {
  const mod = await import('@/modules/business-simulation/pages/ProgramDetailPage')
  return { default: mod.ProgramDetailPage }
})
const WorkspacePage = lazy(async () => {
  const mod = await import('@/modules/business-simulation/pages/WorkspacePage')
  return { default: mod.WorkspacePage }
})
const PublicProfilePage = lazy(async () => ({
  default: (await import('@/pages/public-profile/PublicProfilePage')).PublicProfilePage,
}))

// ── Auth Bootstrap ────────────────────────────────────────────────────────────

function AuthBootstrap(): null {
  useMe()
  useCompany()
  return null
}

// ── Router ───────────────────────────────────────────────────────────────────

export const router = createBrowserRouter([
  {
    path: ROUTES.ROOT,
    element: (
      <ErrorBoundary>
        <Suspense fallback={<Spinner />}>
          <AuthBootstrap />
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    ),
    errorElement: <RouteErrorPage />,
    hydrateFallbackElement: <Spinner />,
    children: [
      // ── Guest-only auth pages (token varsa DASHBOARD-ə yönləndirir) ─────
      {
        element: <GuestGuard />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              { path: ROUTES.AUTH.LOGIN, element: <LoginPage /> },
              { path: ROUTES.AUTH.REGISTER, element: <RegisterPage /> },
              { path: ROUTES.AUTH.VERIFY, element: <VerifyPage /> },
              { path: ROUTES.AUTH.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
              { path: ROUTES.AUTH.RESET_PASSWORD, element: <ResetPasswordPage /> },
            ],
          },
        ],
      },

      // ── Onboarding pages (token var, onboarding bitməyib) ────────────────
      {
        element: <OnboardingGuard />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              { path: ROUTES.AUTH.ROLE, element: <RolePage /> },
              { path: ROUTES.AUTH.ONBOARDING, element: <OnboardingPage /> },
            ],
          },
        ],
      },

      // ── Protected App routes (AuthGuard → AppLayout) ─────────────────────
      {
        element: <AuthGuard />,
        children: [
          {
            element: <AppLayout />,
            children: [
              { path: ROUTES.APP.DASHBOARD, element: <DashboardPage /> },
              { path: ROUTES.APP.PROFILE, element: <ProfilePage /> },
              { path: '/programs', element: <ProgramsLibraryPage /> },
              { path: '/programs/:id', element: <ProgramDetailPage /> },
              { path: '/workspace/:id', element: <WorkspacePage /> },
            ],
          },
        ],
      },

      // ── Public profile (no auth required) ────────────────────────────────
      { path: '/u/:username', element: <PublicProfilePage /> },

      // ── Landing (public) ─────────────────────────────────────────────────
      {
        element: <RootLayout />,
        children: [
          { index: true, element: <LandingPage /> },
        ],
      },
    ],
  },
])
