import { useState, useEffect } from 'react'
import { fetchReservations } from '../../services/reservationService'

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00',
]

export default function RescheduleModal({ reservation, onConfirm, onClose }) {
  const [newDate, setNewDate] = useState(reservation?.date || '')
  const [newTime, setNewTime] = useState(reservation?.time || '')
  const [bookedTimes, setBookedTimes] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (newDate) loadBookedTimes(newDate)
    setNewTime('')
  }, [newDate])

  const loadBookedTimes = async (date) => {
    try {
      const all = await fetchReservations()
      const booked = all
        .filter((r) => r.date === date && r.status !== 'cancelled' && r.id !== reservation?.id)
        .map((r) => r.time)
      setBookedTimes(booked)
    } catch (err) {
      console.error(err)
    }
  }

  const isSlotDisabled = (slot) => {
    if (!newDate) return true
    if (bookedTimes.includes(slot)) return true
    if (newDate === today) {
      const slotTime = new Date(`${newDate}T${slot}`)
      return slotTime <= new Date()
    }
    return false
  }

  const handleConfirm = async () => {
    if (!newDate || !newTime) {
      setError('Please select both date and time.')
      return
    }
    const selectedDateTime = new Date(`${newDate}T${newTime}`)
    if (selectedDateTime <= new Date()) {
      setError('Please select a future date and time.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await onConfirm(newDate, newTime)
    } catch (err) {
      setError('Failed to reschedule. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md">
        <h2
          className="text-xl font-bold text-gray-900 mb-2"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Reschedule Reservation
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Current: <span className="font-medium text-gray-700">{reservation?.date} at {reservation?.time}</span>
        </p>

        <div className="space-y-5">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Date</label>
            <input
              type="date"
              min={today}
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Time Slots */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Time{' '}
              {!newDate && <span className="text-gray-400 font-normal">(select a date first)</span>}
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {TIME_SLOTS.map((slot) => {
                const isBooked = bookedTimes.includes(slot)
                const isDisabled = isSlotDisabled(slot)
                const isPast = !isBooked && isDisabled && newDate
                const isSelected = newTime === slot

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => setNewTime(slot)}
                    className={`py-2 px-1 rounded-lg text-sm font-medium transition-colors
                      ${isBooked
                        ? 'bg-red-50 text-red-300 cursor-not-allowed line-through'
                        : isPast
                          ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                          : isSelected
                            ? 'bg-[#c97830] text-white'
                            : !newDate
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-100 text-gray-600 hover:bg-[#fdf0d5] hover:text-[#c97830]'
                      }`}
                  >
                    {slot}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {error && <p className="error-msg mt-4 text-center">{error}</p>}

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 btn-outline">Cancel</button>
          <button
            onClick={handleConfirm}
            disabled={saving || !newDate || !newTime}
            className="flex-1 btn-primary disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}