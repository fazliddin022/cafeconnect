import { z } from 'zod'

// Phone validation — O'zbekiston va xalqaro format
const phoneRegex = /^(\+998|998)?[\s\-]?([0-9]{2})[\s\-]?([0-9]{3})[\s\-]?([0-9]{2})[\s\-]?([0-9]{2})$/

// Reservation form schema
export const reservationSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name is too long'),
  email: z
    .string()
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine(
      (val) => phoneRegex.test(val.replace(/\s/g, '')),
      'Please enter a valid phone number (e.g. +998 90 123 45 67)'
    ),
  date: z
    .string()
    .min(1, 'Please select a date'),
  time: z
    .string()
    .min(1, 'Please select a time'),
  guests: z
    .number({ invalid_type_error: 'Please enter number of guests' })
    .int()
    .min(1, 'At least 1 guest required')
    .max(12, 'Maximum 12 guests per reservation'),
  notes: z
    .string()
    .max(300, 'Notes must be under 300 characters')
    .optional(),
})

// Contact form schema
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters'),
  email: z
    .string()
    .email('Please enter a valid email address'),
  subject: z
    .string()
    .min(3, 'Subject must be at least 3 characters'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be under 1000 characters'),
})