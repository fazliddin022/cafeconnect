import { useReservationContext } from '../../context/ReservationContext'
import { formatDate } from '../../utils/formatters'

export default function ConfirmationModal() {
  const { showConfirmation, lastReservation, closeConfirmation } = useReservationContext()

  if (!showConfirmation || !lastReservation) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2
          className="text-2xl font-bold text-gray-900 mb-2"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          You're all set!
        </h2>
        <p className="text-gray-500 mb-6">
          Your reservation has been received. We look forward to seeing you!
        </p>

        {/* Reservation Details */}
        <div className="bg-[#fffdf7] rounded-xl p-4 text-left space-y-2 text-sm mb-6">
          <div className="flex justify-between">
            <span className="text-gray-500">Name</span>
            <span className="font-medium">{lastReservation.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date</span>
            <span className="font-medium">{formatDate(lastReservation.date)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Time</span>
            <span className="font-medium">{lastReservation.time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Guests</span>
            <span className="font-medium">{lastReservation.guests}</span>
          </div>
          {lastReservation.notes && (
            <div className="flex justify-between">
              <span className="text-gray-500">Notes</span>
              <span className="font-medium text-right max-w-[60%]">{lastReservation.notes}</span>
            </div>
          )}
        </div>

        <button
          onClick={closeConfirmation}
          className="w-full btn-primary"
        >
          Done
        </button>
      </div>
    </div>
  )
}