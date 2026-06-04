import {
  internStep1Schema,
  mentorStep1Schema,
  mentorStep2Schema,
  mentorStep3Schema,
  partnerStep1Schema
} from '../onboarding.schemas'

describe('internStep1Schema', () => {
  it('valid data passes', () => {
    const input = { cityId: 1, interestIds: [1, 2], skillIds: [], areasOfInterest: '' }
    const result = internStep1Schema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it('missing cityId fails', () => {
    const input = { cityId: 0, interestIds: [1], skillIds: [], areasOfInterest: '' }
    const result = internStep1Schema.safeParse(input)
    expect(result.success).toBe(false)
  })

  it('empty interestIds fails', () => {
    const input = { cityId: 1, interestIds: [], skillIds: [], areasOfInterest: '' }
    const result = internStep1Schema.safeParse(input)
    expect(result.success).toBe(false)
  })
})

describe('mentorStep1Schema', () => {
  it('valid data passes', () => {
    const input = { bio: 'A'.repeat(50), specialization: 'Backend' }
    const result = mentorStep1Schema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it('bio less than 50 chars fails', () => {
    const input = { bio: 'short', specialization: 'Backend' }
    const result = mentorStep1Schema.safeParse(input)
    expect(result.success).toBe(false)
  })

  it('bio more than 500 chars fails', () => {
    const input = { bio: 'A'.repeat(501), specialization: 'Backend' }
    const result = mentorStep1Schema.safeParse(input)
    expect(result.success).toBe(false)
  })

  it('empty specialization fails', () => {
    const input = { bio: 'A'.repeat(50), specialization: 'A' }
    const result = mentorStep1Schema.safeParse(input)
    expect(result.success).toBe(false)
  })
})

describe('mentorStep2Schema', () => {
  it('at least one skill passes', () => {
    const input = { skillIds: [1] }
    const result = mentorStep2Schema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it('empty skillIds fails', () => {
    const input = { skillIds: [] }
    const result = mentorStep2Schema.safeParse(input)
    expect(result.success).toBe(false)
  })
})

describe('mentorStep3Schema', () => {
  it('valid data passes', () => {
    const input = { 
      linkedinUrl: 'https://linkedin.com/in/test', 
      cvStorageUrl: 'https://storage.com/file.pdf',
      cvFileName: 'cv.pdf'
    }
    const result = mentorStep3Schema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it('invalid linkedin url fails', () => {
    const input = { 
      linkedinUrl: 'https://twitter.com/test',
      cvStorageUrl: 'https://storage.com/file.pdf',
      cvFileName: 'cv.pdf'
    }
    const result = mentorStep3Schema.safeParse(input)
    expect(result.success).toBe(false)
  })

  it('empty cvStorageUrl fails', () => {
    const input = { 
      linkedinUrl: 'https://linkedin.com/in/test',
      cvStorageUrl: '',
      cvFileName: ''
    }
    const result = mentorStep3Schema.safeParse(input)
    expect(result.success).toBe(false)
  })
})

describe('partnerStep1Schema', () => {
  const validPartnerInput = {
    name: 'Test Company',
    taxId: '1234567890',
    contactEmail: 'hr@company.com',
    contactPhone: '+994501234567',
    countryId: 1,
    cityId: 1,
    industry: 'Technology'
  }

  it('valid data passes', () => {
    const result = partnerStep1Schema.safeParse(validPartnerInput)
    expect(result.success).toBe(true)
  })

  it('invalid email fails', () => {
    const input = { ...validPartnerInput, contactEmail: 'notanemail' }
    const result = partnerStep1Schema.safeParse(input)
    expect(result.success).toBe(false)
  })

  it('phone without country code fails', () => {
    const input = { ...validPartnerInput, contactPhone: '0501234567' }
    const result = partnerStep1Schema.safeParse(input)
    expect(result.success).toBe(false)
  })

  it('missing countryId fails', () => {
    const input = { ...validPartnerInput, countryId: 0 }
    const result = partnerStep1Schema.safeParse(input)
    expect(result.success).toBe(false)
  })
})
