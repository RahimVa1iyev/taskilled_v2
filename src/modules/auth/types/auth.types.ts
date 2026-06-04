export type RoleId = 'intern' | 'mentor' | 'partner'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
}

export interface AuthResponse {
  isSuccess: boolean
  message: string
  data: AuthTokens
}

export interface OtpVerifyResponse {
  isSuccess: boolean
  message: string
  data: AuthTokens
}

export interface ResendOtpResponse {
  isSuccess: boolean
  message: string
}

export interface ForgotPasswordResponse {
  isSuccess: boolean
  message: string
}

export interface ResetPasswordResponse {
  isSuccess: boolean
  message: string
}

export type OtpFlow = 'register' | 'login' | 'forgot-password'

export interface LoginDto {
  email: string
  password: string
}

export interface OtpVerifyDto {
  email: string
  otp: number
}

export interface ResendOtpDto {
  email: string
}

export interface ForgotPasswordDto {
  email: string
}

export interface ResetPasswordDto {
  password: string
  repeatPassword: string
}

export interface RegisterDto {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface RegisterResponse {
  isSuccess: boolean
  message: string
  email: string
}

export interface CityResponse {
  id: number
  name: string
  countryId: number
}

export interface CountryResponse {
  id: number
  name: string
}

export interface RoleResponse {
  id: number
  name: 'user' | 'intern' | 'mentor' | 'partner'
  descriptionAz: string | null
  descriptionEn: string | null
  descriptionRu: string | null
  descriptionTr: string | null
}

export interface InterestResponse {
  id: number
  nameAz: string
  nameEn: string
  nameRu: string
  nameTr: string
}

export interface SkillResponse {
  id: number
  name: string
  level?: 'Beginner' | 'Elementary' | 'Intermediate' | 'Advanced' | 'Expert' | null
}

export interface UserLanguageResponse {
  id: number
  language: string
  languageLevel: string
}

export interface ExperienceResponse {
  id: number
  company: string
  position: string
  startDate: string
  endDate: string | null
  description: string | null
}

export interface EducationResponse {
  id: number
  schoolName: string
  degree: string | null
  fieldOfStudy: string | null
  startDate: string | null
  endDate: string | null
}

export interface CertificateResponse {
  id: number
  name: string
  description: string | null
  certificateUrl: string | null
  issuer: string | null
  issuedDate: string | null
}

export interface UserProfile {
  id: number
  email: string
  role: RoleResponse | null
  firstName: string | null
  lastName: string | null
  phoneNumber: string | null
  interests: InterestResponse[] | null
  country: CountryResponse | null
  city: CityResponse | null
  gender: 'Male' | 'Female' | null
  birthDate: string | null
  webSite: string | null
  cvUrl: string | null
  imgUrl: string | null
  bio: string | null
  areasOfInterest: string | null
  languages: UserLanguageResponse[] | null
  certificates: CertificateResponse[] | null
  experiences: ExperienceResponse[]
  educations: EducationResponse[] | null
  skills: SkillResponse[] | null
  requiredFields: string[]
}

export interface UserUpdateDto {
  roleId?: number | null
  cityId?: number | null
  countryId?: number | null
  interests?: { interestId: number }[] | null
  areasOfInterest?: string | null
  bio?: string | null
  cvUrl?: string | null
  imgUrl?: string | null
  firstName?: string | null
  lastName?: string | null
}

export type MeResponse = UserProfile
