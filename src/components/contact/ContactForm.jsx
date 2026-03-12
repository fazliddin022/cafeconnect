import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema } from '../../utils/validators'
import { submitContact } from '../../services/contactService'
import { useState } from 'react'

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setError(null)
    try {
      await submitContact(data)
      setIsSuccess(true)
      reset()
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <p className="text-5xl mb-4">✅</p>
        <h3
          className="text-2xl font-bold text-gray-900 mb-2"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Message Sent!
        </h3>
        <p className="text-gray-500 mb-6">
          Thank you for reaching out. We'll get back to you soon.
        </p>
        <button onClick={() => setIsSuccess(false)} className="btn-primary">
          Send Another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            {...register('name')}
            className="input-field"
            placeholder="John Doe"
          />
          {errors.name && <p className="error-msg">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            className="input-field"
            placeholder="john@email.com"
          />
          {errors.email && <p className="error-msg">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Subject
        </label>
        <input
          {...register('subject')}
          className="input-field"
          placeholder="How can we help?"
        />
        {errors.subject && <p className="error-msg">{errors.subject.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <textarea
          {...register('message')}
          rows={5}
          className="input-field resize-none"
          placeholder="Write your message here..."
        />
        {errors.message && <p className="error-msg">{errors.message.message}</p>}
      </div>

      {error && <p className="error-msg text-center">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            Sending...
          </span>
        ) : (
          'Send Message'
        )}
      </button>
    </form>
  )
}