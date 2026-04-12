import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema } from '../../utils/validators'
import { submitContact } from '../../services/contactService'
import { useState } from 'react'

const inputClass = (error, value) => {
  if (error) return 'input-field border-red-400 focus:ring-red-400'
  if (value) return 'input-field border-green-400 focus:ring-green-400'
  return 'input-field'
}

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    mode: 'onChange',
  })

  const watchedName = watch('name')
  const watchedEmail = watch('email')
  const watchedSubject = watch('subject')
  const watchedMessage = watch('message')

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
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            {...register('name')}
            className={inputClass(errors.name, watchedName && !errors.name)}
            placeholder="John Doe"
          />
          {errors.name ? (
            <p className="error-msg flex items-center gap-1 mt-1">
              <span>⚠️</span> {errors.name.message}
            </p>
          ) : watchedName?.length >= 2 ? (
            <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
              <span>✓</span> Looks good!
            </p>
          ) : null}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            {...register('email')}
            type="email"
            className={inputClass(errors.email, watchedEmail && !errors.email)}
            placeholder="john@email.com"
          />
          {errors.email ? (
            <p className="error-msg flex items-center gap-1 mt-1">
              <span>⚠️</span> {errors.email.message}
            </p>
          ) : watchedEmail && !errors.email ? (
            <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
              <span>✓</span> Valid email
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
        <input
          {...register('subject')}
          className={inputClass(errors.subject, watchedSubject && !errors.subject)}
          placeholder="How can we help?"
        />
        {errors.subject ? (
          <p className="error-msg flex items-center gap-1 mt-1">
            <span>⚠️</span> {errors.subject.message}
          </p>
        ) : watchedSubject?.length >= 3 ? (
          <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
            <span>✓</span> Looks good!
          </p>
        ) : null}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea
          {...register('message')}
          rows={5}
          className={inputClass(errors.message, watchedMessage && !errors.message)}
          placeholder="Write your message here..."
        />
        <div className="flex justify-between items-center mt-1">
          {errors.message ? (
            <p className="error-msg flex items-center gap-1">
              <span>⚠️</span> {errors.message.message}
            </p>
          ) : watchedMessage?.length >= 10 ? (
            <p className="text-green-500 text-xs flex items-center gap-1">
              <span>✓</span> Looks good!
            </p>
          ) : (
            <span />
          )}
          <span className={`text-xs ${watchedMessage?.length > 900 ? 'text-red-400' : 'text-gray-400'}`}>
            {watchedMessage?.length || 0} / 1000
          </span>
        </div>
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