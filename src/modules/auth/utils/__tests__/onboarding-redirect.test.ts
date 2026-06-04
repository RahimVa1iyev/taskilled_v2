import { ROUTES } from '@/shared/constants/routes'
import { redirectByRequiredFields } from '../onboarding-redirect'

describe('redirectByRequiredFields', () => {
  const navigate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Empty array goes to HOME', () => {
    redirectByRequiredFields([], navigate)
    expect(navigate).toHaveBeenCalledWith(ROUTES.APP.DASHBOARD, { replace: true })
    expect(navigate).toHaveBeenCalledTimes(1)
  })

  it("['role'] goes to ROLE page", () => {
    redirectByRequiredFields(['role'], navigate)
    expect(navigate).toHaveBeenCalledWith(ROUTES.AUTH.ROLE, { replace: true })
    expect(navigate).toHaveBeenCalledTimes(1)
  })

  it("['role', 'city'] goes to ROLE page (role takes priority)", () => {
    redirectByRequiredFields(['role', 'city'], navigate)
    expect(navigate).toHaveBeenCalledWith(ROUTES.AUTH.ROLE, { replace: true })
    expect(navigate).toHaveBeenCalledTimes(1)
  })

  it("['city'] goes to ONBOARDING", () => {
    redirectByRequiredFields(['city'], navigate)
    expect(navigate).toHaveBeenCalledWith(ROUTES.AUTH.ONBOARDING, { replace: true })
    expect(navigate).toHaveBeenCalledTimes(1)
  })

  it("['city', 'interests'] goes to ONBOARDING", () => {
    redirectByRequiredFields(['city', 'interests'], navigate)
    expect(navigate).toHaveBeenCalledWith(ROUTES.AUTH.ONBOARDING, { replace: true })
    expect(navigate).toHaveBeenCalledTimes(1)
  })
})
