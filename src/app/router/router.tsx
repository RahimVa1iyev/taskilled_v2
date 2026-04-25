import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { RootLayout } from '@/app/layouts/RootLayout'
import { AuthGuard } from '@/app/router/guards/AuthGuard'
import { ROUTES } from '@/shared/constants/routes'
import { ErrorBoundary } from '@/shared/ui/custom/ErrorBoundary'
import { RouteErrorPage } from '@/shared/ui/custom/RouteErrorPage'
import { Spinner } from '@/shared/ui/custom/Spinner'

const LandingPage = lazy(async () => ({
  default: (await import('@/pages/landing/LandingPage')).LandingPage,
}))
const HomePage = lazy(async () => ({
  default: (await import('@/pages/home/HomePage')).HomePage,
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

export const router = createBrowserRouter([
  {
    path: ROUTES.ROOT,
    element: (
      <ErrorBoundary>
        <RootLayout />
      </ErrorBoundary>
    ),
    errorElement: <RouteErrorPage />,
    hydrateFallbackElement: <Spinner />,
    children: [
      { index: true, element: <LandingPage /> },
      {
        element: <AuthGuard />,
        children: [{ path: ROUTES.HOME, element: <HomePage /> }],
      },
      { path: ROUTES.AUTH.LOGIN, element: <LoginPage /> },
      { path: ROUTES.AUTH.REGISTER, element: <RegisterPage /> },
      { path: ROUTES.AUTH.VERIFY, element: <VerifyPage /> },
      { path: ROUTES.AUTH.ROLE, element: <RolePage /> },
      { path: ROUTES.AUTH.ONBOARDING, element: <OnboardingPage /> },
      { path: ROUTES.AUTH.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
      { path: ROUTES.AUTH.RESET_PASSWORD, element: <ResetPasswordPage /> },
    ],
  },
])

