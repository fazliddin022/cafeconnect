import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  fetchMyReservations,
  cancelReservation,
  rescheduleReservation,
  autoCompleteReservations,
} from '../services/reservationService'
import RescheduleModal from '../components/reservation/RescheduleModal'
import ReviewModal from '../components/reviews/ReviewModal'
import { hasReviewed } from '../services/reviewService'

const STATUS_STYLES = {
  pending:     'bg-yellow-100 text-yellow-800',
  confirmed:   'bg-green-100 text-green-800',
  cancelled:   'bg-red-100 text-red-800',
  completed:   'bg-gray-100 text-gray-600',
  rescheduled: 'bg-blue-100 text-blue-800',
}

function isWithin30Minutes(date, time) {
  const reservationTime = new Date(`${date}T${time}`)
  const now = new Date()
  const diffMinutes = (reservationTime - now) / 1000 / 60
  return diffMinutes < 30
}

export default function MyReservationsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [rescheduleTarget, setRescheduleTarget] = useState(null)
  const [confirmCancel, setConfirmCancel] = useState(null)
  const [reviewTarget, setReviewTarget] = useState(null)
  const [reviewedIds, setReviewedIds] = useState([])

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    loadReservations()
  }, [user])

  const loadReservations = async () => {
    setLoading(true)
    try {
      await autoCompleteReservations()
      const data = await fetchMyReservations(user.email)
      const sorted = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
      setReservations(sorted)

      // Qaysi reservationlar uchun review qoldirilganini tekshiramiz
      const reviewed = await Promise.all(
        sorted
          .filter((r) => r.status === 'completed')
          .map(async (r) => {
            const already = await hasReviewed(user.uid, r.id)
            return already ? r.id : null
          })
      )
      setReviewedIds(reviewed.filter(Boolean))
    } catch (err) {
      setError('Failed to load reservations.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = (id, date, time) => {
    if (isWithin30Minutes(date, time)) return
    setConfirmCancel({ id, date, time })
  }

  const confirmCancelAction = async () => {
    const { id } = confirmCancel
    setConfirmCancel(null)
    try {
      await cancelReservation(id)
      setReservations((prev) =>
        prev.map((r) => r.id === id ? { ...r, status: 'cancelled' } : r)
      )
    } catch (err) {
      alert('Failed to cancel. Please try again.')
    }
  }

  const handleRescheduleConfirm = async (newDate, newTime) => {
    await rescheduleReservation(rescheduleTarget.id, newDate, newTime)
    setReservations((prev) =>
      prev.map((r) =>
        r.id === rescheduleTarget.id
          ? { ...r, date: newDate, time: newTime, status: 'rescheduled' }
          : r
      )
    )
    setRescheduleTarget(null)
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1
          className="text-3xl font-bold text-gray-900"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          My Reservations
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your upcoming and past bookings
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : error ? (
        <div className="text-center py-20 text-red-400">{error}</div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📅</p>
          <p className="text-gray-500 mb-6">You have no reservations yet.</p>
          <button
            onClick={() => navigate('/reservation')}
            className="btn-primary"
          >
            Make a Reservation
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((r) => {
            const locked = isWithin30Minutes(r.date, r.time)
            const canModify = r.status !== 'cancelled' && r.status !== 'completed'

            return (
              <div
                key={r.id}
                className="bg-white rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-semibold text-gray-900 text-lg">
                      {r.date} — {r.time}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[r.status] || 'bg-gray-100 text-gray-600'}`}>
                      {r.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">
                    👥 {r.guests} guests
                    {r.notes && <span className="ml-3 italic">"{r.notes}"</span>}
                  </p>
                  {locked && canModify && (
                    <p className="text-red-400 text-xs mt-1">
                      ⚠️ Cannot modify — less than 30 minutes before booking
                    </p>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  {canModify && (
                    <>
                      <button
                        onClick={() => setRescheduleTarget(r)}
                        disabled={locked}
                        className="px-4 py-2 rounded-lg border border-[#c97830] text-[#c97830] text-sm font-medium hover:bg-[#fdf0d5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => handleCancel(r.id, r.date, r.time)}
                        disabled={locked}
                        className="px-4 py-2 rounded-lg border border-red-400 text-red-400 text-sm font-medium hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {r.status === 'completed' && !reviewedIds.includes(r.id) && (
                    <button
                      onClick={() => setReviewTarget(r)}
                      className="px-4 py-2 rounded-lg bg-[#fdf0d5] text-[#c97830] text-sm font-medium hover:bg-[#e9ae6b] hover:text-white transition-colors"
                    >
                      ⭐ Leave a Review
                    </button>
                  )}

                  {r.status === 'completed' && reviewedIds.includes(r.id) && (
                    <span className="text-sm text-gray-400 py-2">✅ Reviewed</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleTarget && (
        <RescheduleModal
          reservation={rescheduleTarget}
          onConfirm={handleRescheduleConfirm}
          onClose={() => setRescheduleTarget(null)}
        />
      )}

      {/* Review Modal */}
      {reviewTarget && (
        <ReviewModal
          reservation={reviewTarget}
          onClose={() => setReviewTarget(null)}
          onSubmitted={() => {
            setReviewedIds((prev) => [...prev, reviewTarget.id])
            setReviewTarget(null)
          }}
        />
      )}

      {/* Cancel Confirm Modal */}
      {confirmCancel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center shadow-xl">
            <p className="text-4xl mb-4">🗑️</p>
            <h2
              className="text-xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Cancel Reservation?
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Are you sure you want to cancel your reservation on{' '}
              <span className="font-medium text-gray-700">
                {confirmCancel.date} at {confirmCancel.time}
              </span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmCancel(null)}
                className="flex-1 btn-outline"
              >
                Keep it
              </button>
              <button
                onClick={confirmCancelAction}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}