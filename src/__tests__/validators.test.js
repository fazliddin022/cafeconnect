import { reservationSchema, contactSchema, loginSchema, registerSchema } from '../utils/validators'

describe('reservationSchema', () => {
  const validData = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '+998 90 123 45 67',
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

  it('fails with invalid phone', () => {
    const result = reservationSchema.safeParse({ ...validData, phone: '123' })
    expect(result.success).toBe(false)
  })

  it('passes with valid uzbek phone without spaces', () => {
    const result = reservationSchema.safeParse({ ...validData, phone: '+998901234567' })
    expect(result.success).toBe(true)
  })

  it('passes with valid uzbek phone without +', () => {
    const result = reservationSchema.safeParse({ ...validData, phone: '998901234567' })
    expect(result.success).toBe(true)
  })

  it('passes with valid US phone', () => {
    const result = reservationSchema.safeParse({ ...validData, phone: '+15551234567' })
    expect(result.success).toBe(true)
  })

  it('passes with valid UK phone', () => {
    const result = reservationSchema.safeParse({ ...validData, phone: '+442079460958' })
    expect(result.success).toBe(true)
  })

  it('fails with notes exceeding max length', () => {
    const result = reservationSchema.safeParse({ ...validData, notes: 'a'.repeat(301) })
    expect(result.success).toBe(false)
  })

  it('passes with optional notes within limit', () => {
    const result = reservationSchema.safeParse({ ...validData, notes: 'Window seat please.' })
    expect(result.success).toBe(true)
  })

  it('fails with missing date', () => {
    const result = reservationSchema.safeParse({ ...validData, date: '' })
    expect(result.success).toBe(false)
  })

  it('fails with missing time', () => {
    const result = reservationSchema.safeParse({ ...validData, time: '' })
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

  it('fails with message too long', () => {
    const result = contactSchema.safeParse({ ...validData, message: 'a'.repeat(1001) })
    expect(result.success).toBe(false)
  })

  it('fails with missing subject', () => {
    const result = contactSchema.safeParse({ ...validData, subject: '' })
    expect(result.success).toBe(false)
  })

  it('fails with subject too short', () => {
    const result = contactSchema.safeParse({ ...validData, subject: 'Hi' })
    expect(result.success).toBe(false)
  })

  it('fails with invalid email', () => {
    const result = contactSchema.safeParse({ ...validData, email: 'not-email' })
    expect(result.success).toBe(false)
  })

  it('fails with name too short', () => {
    const result = contactSchema.safeParse({ ...validData, name: 'J' })
    expect(result.success).toBe(false)
  })
})

describe('loginSchema', () => {
  const validData = {
    email: 'user@example.com',
    password: 'Password1',
  }

  it('passes with valid data', () => {
    const result = loginSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('fails with invalid email', () => {
    const result = loginSchema.safeParse({ ...validData, email: 'not-email' })
    expect(result.success).toBe(false)
  })

  it('fails with empty email', () => {
    const result = loginSchema.safeParse({ ...validData, email: '' })
    expect(result.success).toBe(false)
  })

  it('fails with password too short', () => {
    const result = loginSchema.safeParse({ ...validData, password: '123' })
    expect(result.success).toBe(false)
  })
})

describe('registerSchema', () => {
  const validData = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'Password1',
  }

  it('passes with valid data', () => {
    const result = registerSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('fails with name too short', () => {
    const result = registerSchema.safeParse({ ...validData, name: 'J' })
    expect(result.success).toBe(false)
  })

  it('fails with invalid email', () => {
    const result = registerSchema.safeParse({ ...validData, email: 'not-email' })
    expect(result.success).toBe(false)
  })

  it('fails with password without uppercase', () => {
    const result = registerSchema.safeParse({ ...validData, password: 'password1' })
    expect(result.success).toBe(false)
  })

  it('fails with password without number', () => {
    const result = registerSchema.safeParse({ ...validData, password: 'Password' })
    expect(result.success).toBe(false)
  })

  it('fails with password too short', () => {
    const result = registerSchema.safeParse({ ...validData, password: 'Pass1' })
    expect(result.success).toBe(false)
  })

  it('fails with name too long', () => {
    const result = registerSchema.safeParse({ ...validData, name: 'a'.repeat(61) })
    expect(result.success).toBe(false)
  })
})