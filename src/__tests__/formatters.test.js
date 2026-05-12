import { formatPrice, formatDate, truncateText } from '../utils/formatters'

describe('formatPrice', () => {
  it('formats a whole number price correctly', () => {
    expect(formatPrice(5)).toBe('$5.00')
  })

  it('formats a decimal price correctly', () => {
    expect(formatPrice(4.5)).toBe('$4.50')
  })

  it('formats zero correctly', () => {
    expect(formatPrice(0)).toBe('$0.00')
  })

  it('formats a large price correctly', () => {
    expect(formatPrice(1000)).toBe('$1,000.00')
  })

  it('formats with a different currency', () => {
    expect(formatPrice(10, 'EUR')).toBe('€10.00')
  })
})

describe('formatDate', () => {
  it('formats a date string to readable format', () => {
    const result = formatDate('2026-05-11')
    expect(result).toContain('2026')
    expect(result).toContain('May')
    expect(result).toContain('11')
  })

  it('includes weekday in formatted date', () => {
    const result = formatDate('2026-05-11')
    expect(result).toMatch(/Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/)
  })

  it('formats different months correctly', () => {
    const result = formatDate('2026-01-01')
    expect(result).toContain('January')
  })
})

describe('truncateText', () => {
  it('does not truncate text within limit', () => {
    const text = 'Hello world'
    expect(truncateText(text, 20)).toBe('Hello world')
  })

  it('truncates text exceeding limit', () => {
    const text = 'a'.repeat(150)
    const result = truncateText(text, 100)
    expect(result).toHaveLength(103) // 100 + '...'
    expect(result.endsWith('...')).toBe(true)
  })

  it('uses default max length of 100', () => {
    const text = 'a'.repeat(150)
    const result = truncateText(text)
    expect(result.endsWith('...')).toBe(true)
    expect(result).toHaveLength(103)
  })

  it('returns exact text when length equals limit', () => {
    const text = 'a'.repeat(100)
    expect(truncateText(text, 100)).toBe(text)
  })

  it('handles empty string', () => {
    expect(truncateText('', 100)).toBe('')
  })
})