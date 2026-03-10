import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reservationSchema } from '../../utils/validators'
import { useReservationContext } from '../../context/ReservationContext'
import { useState } from 'react'

export default function ReservationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { confirmReservation } = useReservationContext()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reservationSchema),
    defaultValues: { guests: 2 },
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      // TODO: Firebase integration later
      await new Promise((resolve) => setTimeout(resolve, 800))
      confirmReservation(data)
      reset()
    } finally {
      setIsSubmitting(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Name */}
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

      {/* Email + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            {...register('phone')}
            type="tel"
            className="input-field"
            placeholder="+1 234 567 8900"
          />
          {errors.phone && <p className="error-msg">{errors.phone.message}</p>}
        </div>
      </div>

      {/* Date + Time + Guests */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            {...register('date')}
            type="date"
            min={today}
            className="input-field"
          />
          {errors.date && <p className="error-msg">{errors.date.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time
          </label>
          <input
            {...register('time')}
            type="time"
            className="input-field"
          />
          {errors.time && <p className="error-msg">{errors.time.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Guests
          </label>
          <input
            {...register('guests', { valueAsNumber: true })}
            type="number"
            min={1}
            max={12}
            className="input-field"
          />
          {errors.guests && <p className="error-msg">{errors.guests.message}</p>}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Special Requests <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          {...register('notes')}
          rows={3}
          className="input-field resize-none"
          placeholder="Allergies, seating preferences, occasion..."
        />
        {errors.notes && <p className="error-msg">{errors.notes.message}</p>}
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
            Confirming...
          </span>
        ) : (
          'Confirm Reservation'
        )}
      </button>
    </form>
  )
}