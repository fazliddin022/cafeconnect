import { reservationSchema, contactSchema } from '../utils/validators'

describe('reservationSchema', () => {
  const validData = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '+1 555 123 4567',
    date: '2026-04-01',
    time: '19:00',
    guests: 2,
  }

  it('passes with valid data', () => {
    const result = reservationSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('fails with invalid email', () => {
    const result = reservationSchema.safeParse({ ...validData, email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  it('fails with name too short', () => {
    const result = reservationSchema.safeParse({ ...validData, name: 'A' })
    expect(result.success).toBe(false)
  })

  it('fails with guests exceeding max', () => {
    const result = reservationSchema.safeParse({ ...validData, guests: 20 })
    expect(result.success).toBe(false)
  })

  it('fails with guests below min', () => {
    const result = reservationSchema.safeParse({ ...validData, guests: 0 })
    expect(result.success).toBe(false)
  })
})

describe('contactSchema', () => {
  const validData = {
    name: 'John Smith',
    email: 'john@example.com',
    subject: 'Hello there',
    message: 'I have a question about your events.',
  }

  it('passes with valid data', () => {
    const result = contactSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('fails with message too short', () => {
    const result = contactSchema.safeParse({ ...validData, message: 'Hi' })
    expect(result.success).toBe(false)
  })

  it('fails with missing subject', () => {
    const result = contactSchema.safeParse({ ...validData, subject: '' })
    expect(result.success).toBe(false)
  })
})