import { parseApiError } from '@/shared/utils/error.utils'

describe('parseApiError', () => {
  it('Axios-style error with string message in response.data.message', () => {
    const input = { response: { data: { message: 'Server xətası' } } }
    expect(parseApiError(input)).toBe('Server xətası')
  })

  it('Axios-style error with nested object message', () => {
    const input = { response: { data: { message: { message: 'Nested xəta' } } } }
    expect(parseApiError(input)).toBe('Nested xəta')
  })

  it('Standard JS Error object', () => {
    const input = new Error('JS xətası')
    expect(parseApiError(input)).toBe('JS xətası')
  })

  it('Plain string', () => {
    const input = 'string xəta'
    expect(parseApiError(input)).toBe('string xəta')
  })

  it('Unknown/empty object', () => {
    const input = {}
    expect(parseApiError(input)).toBe('Xəta baş verdi')
  })

  it('null input', () => {
    const input = null
    expect(parseApiError(input)).toBe('Xəta baş verdi')
  })

  it('undefined input', () => {
    const input = undefined
    expect(parseApiError(input)).toBe('Xəta baş verdi')
  })
})
