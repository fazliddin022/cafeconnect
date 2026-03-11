import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema } from '../../utils/validators'
import { useState } from 'react'

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(contactSchema) })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      // TODO: Firebase integration later
      await new Promise((resolve) => setTimeout(resolve, 800))
      console.log('Contact submitted:', data)
      setSuccess(true)
      reset()
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">✉️</div>
        <h3
          className="text-xl font-semibold mb-2"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Message Sent!
        </h3>
        <p className="text-gray-500 mb-6">
          We'll get back to you as soon as possible.
        </p>
        <button onClick={() => setSuccess(false)} className="btn-outline">
          Send Another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            {...register('name')}
            className="input-field"
            placeholder="Your name"
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
            placeholder="your@email.com"
          />
          {errors.email && <p className="error-msg">{errors.email.message}</p>}
        </div>
      </div>

      {/* Subject */}
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

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <textarea
          {...register('message')}
          rows={5}
          className="input-field resize-none"
          placeholder="Write your message..."
        />
        {errors.message && <p className="error-msg">{errors.message.message}</p>}
      </div>

      {/* Submit */}
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