import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reservationSchema } from '../../utils/validators'
import { useReservationContext } from '../../context/ReservationContext'
import { useAuth } from '../../context/AuthContext'
import { submitReservation, fetchReservations } from '../../services/reservationService'
import { getUserPhone, saveUserPhone } from '../../services/authService'
import { useState, useEffect } from 'react'

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00',
]

const inputClass = (error, value) => {
  if (error) return 'input-field border-red-400 focus:ring-red-400'
  if (value) return 'input-field border-green-400 focus:ring-green-400'
  return 'input-field'
}

export default function ReservationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [bookedTimes, setBookedTimes] = useState([])
  const [selectedDate, setSelectedDate] = useState('')
  const { confirmReservation } = useReservationContext()
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      guests: 2,
      name: user?.displayName || '',
      email: user?.email || '',
    },
    mode: 'onChange',
  })

  const watchedDate = watch('date')
  const watchedName = watch('name')
  const watchedEmail = watch('email')
  const watchedPhone = watch('phone')
  const watchedGuests = watch('guests')

  // Phone ni Firebase dan yuklash
  useEffect(() => {
    if (!user) return
    const loadPhone = async () => {
      const phone = await getUserPhone(user.uid)
      if (phone) setValue('phone', phone)
    }
    loadPhone()
  }, [user])

  useEffect(() => {
    if (!watchedDate) return
    setSelectedDate(watchedDate)
    loadBookedTimes(watchedDate)
    setValue('time', '')
  }, [watchedDate])

  const loadBookedTimes = async (date) => {
    try {
      const all = await fetchReservations()
      const booked = all
        .filter((r) => r.date === date && r.status !== 'cancelled')
        .map((r) => r.time)
      setBookedTimes(booked)
    } catch (err) {
      console.error(err)
    }
  }

  const isSlotDisabled = (slot) => {
    if (!selectedDate) return true
    if (bookedTimes.includes(slot)) return true
    const today = new Date().toISOString().split('T')[0]
    if (selectedDate === today) {
      const slotTime = new Date(`${selectedDate}T${slot}`)
      return slotTime <= new Date()
    }
    return false
  }

  const onSubmit = async (data) => {
  setIsSubmitting(true)
  setError(null)
  try {
    const id = await submitReservation(data)
    await saveUserPhone(user.uid, data.phone)
    confirmReservation({ ...data, id })
    reset({
      guests: 2,
      name: user?.displayName || '',
      email: user?.email || '',
      phone: data.phone,
    })
    setBookedTimes([])
    setSelectedDate('')
  } catch (err) {
    console.error(err)
    setError('Something went wrong. Please try again.')
  } finally {
    setIsSubmitting(false)
  }
}

  const today = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input
          {...register('name')}
          className={inputClass(errors.name, watchedName)}
          placeholder="John Doe"
        />
        {errors.name ? (
          <p className="error-msg flex items-center gap-1 mt-1"><span>⚠️</span> {errors.name.message}</p>
        ) : watchedName?.length >= 2 ? (
          <p className="text-green-500 text-xs mt-1 flex items-center gap-1"><span>✓</span> Looks good!</p>
        ) : null}
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            {...register('email')}
            type="email"
            className={inputClass(errors.email, watchedEmail && !errors.email)}
            placeholder="john@email.com"
          />
          {errors.email ? (
            <p className="error-msg flex items-center gap-1 mt-1"><span>⚠️</span> {errors.email.message}</p>
          ) : watchedEmail && !errors.email ? (
            <p className="text-green-500 text-xs mt-1 flex items-center gap-1"><span>✓</span> Valid email</p>
          ) : null}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            {...register('phone')}
            type="tel"
            className={inputClass(errors.phone, watchedPhone && !errors.phone)}
            placeholder="+998 90 123 45 67"
          />
          {errors.phone ? (
            <p className="error-msg flex items-center gap-1 mt-1"><span>⚠️</span> {errors.phone.message}</p>
          ) : watchedPhone && !errors.phone ? (
            <p className="text-green-500 text-xs mt-1 flex items-center gap-1"><span>✓</span> Valid phone number</p>
          ) : null}
        </div>
      </div>

      {/* Date + Guests */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            {...register('date')}
            type="date"
            min={today}
            className={inputClass(errors.date, watchedDate && !errors.date)}
          />
          {errors.date && (
            <p className="error-msg flex items-center gap-1 mt-1"><span>⚠️</span> {errors.date.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
          <input
            {...register('guests', { valueAsNumber: true })}
            type="number"
            min={1}
            max={12}
            className={inputClass(errors.guests, watchedGuests && !errors.guests)}
          />
          {errors.guests && (
            <p className="error-msg flex items-center gap-1 mt-1"><span>⚠️</span> {errors.guests.message}</p>
          )}
        </div>
      </div>

      {/* Time Slots */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Time {!selectedDate && <span className="text-gray-400 font-normal">(select a date first)</span>}
        </label>
        <Controller
          name="time"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {TIME_SLOTS.map((slot) => {
                const isBooked = bookedTimes.includes(slot)
                const isDisabled = isSlotDisabled(slot)
                const isPast = !isBooked && isDisabled && selectedDate
                const isSelected = field.value === slot

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => field.onChange(slot)}
                    className={`py-2 px-1 rounded-lg text-sm font-medium transition-colors
                      ${isBooked
                        ? 'bg-red-50 text-red-300 cursor-not-allowed line-through'
                        : isPast
                          ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                          : isSelected
                            ? 'bg-[#c97830] text-white'
                            : !selectedDate
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-100 text-gray-600 hover:bg-[#fdf0d5] hover:text-[#c97830]'
                      }`}
                  >
                    {slot}
                  </button>
                )
              })}
            </div>
          )}
        />
        {errors.time && (
          <p className="error-msg flex items-center gap-1 mt-1"><span>⚠️</span> {errors.time.message}</p>
        )}
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
        {errors.notes && (
          <p className="error-msg flex items-center gap-1 mt-1"><span>⚠️</span> {errors.notes.message}</p>
        )}
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
            Confirming...
          </span>
        ) : (
          'Confirm Reservation'
        )}
      </button>
    </form>
  )
}