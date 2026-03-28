import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logoutAdmin } from '../services/authService'
import {
  fetchReservations,
  updateReservationStatus,
  rescheduleReservation,
  autoCompleteReservations,
} from '../services/reservationService'
import RescheduleModal from '../components/reservation/RescheduleModal'

const STATUS_STYLES = {
  pending:     'bg-yellow-100 text-yellow-800',
  confirmed:   'bg-green-100 text-green-800',
  cancelled:   'bg-red-100 text-red-800',
  completed:   'bg-gray-100 text-gray-600',
  rescheduled: 'bg-blue-100 text-blue-800',
}

const STATUS_OPTIONS = ['pending', 'confirmed', 'completed', 'cancelled']

export default function StaffPage() {
  const { user, role } = useAuth()
  const navigate = useNavigate()
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [rescheduleTarget, setRescheduleTarget] = useState(null)
  const [confirmCancel, setConfirmCancel] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true })
      return
    }
    if (role && role !== 'staff') {
      navigate('/', { replace: true })
      return
    }
    if (role === 'staff') loadData()
  }, [user, role])

  const loadData = async () => {
    setLoading(true)
    try {
      await autoCompleteReservations()
      const data = await fetchReservations()
      // Faqat bugungi reservationlar
      const today = new Date().toISOString().split('T')[0]
      const todayReservations = data.filter((r) => r.date === today)
      const sorted = todayReservations.sort((a, b) => a.time.localeCompare(b.time))
      setReservations(sorted)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id)
    try {
      await updateReservationStatus(id, newStatus)
      setReservations((prev) =>
        prev.map((r) => r.id === id ? { ...r, status: newStatus } : r)
      )
    } catch (err) {
      alert('Failed to update status.')
    } finally {
      setUpdatingId(null)
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

  const handleCancelReservation = (id, date, time) => {
    setConfirmCancel({ id, date, time })
  }

  const confirmCancelAction = async () => {
    const { id } = confirmCancel
    setConfirmCancel(null)
    try {
      await updateReservationStatus(id, 'cancelled')
      setReservations((prev) =>
        prev.map((r) => r.id === id ? { ...r, status: 'cancelled' } : r)
      )
    } catch (err) {
      alert('Failed to cancel.')
    }
  }

  const handleLogout = async () => {
    await logoutAdmin()
    navigate('/login')
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-[#fffdf7]">
      {/* Header */}
      <div className="bg-[#c97830] text-white px-8 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
          ☕ CaféConnect Staff
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm opacity-80">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="bg-white text-[#c97830] px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: 'Playfair Display, serif' }}>
            Today's Reservations ({reservations.length})
          </h2>
          <p className="text-gray-500 text-sm mt-1">{today}</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📅</p>
            <p className="text-gray-500">No reservations for today.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['Name', 'Email', 'Time', 'Guests', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reservations.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{r.name}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{r.email}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm font-medium">{r.time}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{r.guests}</td>
                    <td className="px-6 py-4">
                      {updatingId === r.id ? (
                        <span className="text-gray-400 text-sm">Updating...</span>
                      ) : r.status === 'cancelled' || r.status === 'completed' ? (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[r.status]}`}>
                          {r.status}
                        </span>
                      ) : (
                        <select
                          value={r.status}
                          onChange={(e) => handleStatusChange(r.id, e.target.value)}
                          className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#c97830] ${STATUS_STYLES[r.status] || 'bg-gray-100 text-gray-600'}`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {r.status !== 'cancelled' && r.status !== 'completed' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setRescheduleTarget(r)}
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-[#c97830] hover:text-[#c97830] transition-colors"
                            title="Reschedule"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleCancelReservation(r.id, r.date, r.time)}
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-red-400 hover:text-red-400 transition-colors"
                            title="Cancel"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {rescheduleTarget && (
        <RescheduleModal
          reservation={rescheduleTarget}
          onConfirm={handleRescheduleConfirm}
          onClose={() => setRescheduleTarget(null)}
        />
      )}

      {/* Cancel Confirm Modal */}
      {confirmCancel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center shadow-xl">
            <p className="text-4xl mb-4">🗑️</p>
            <h2 className="text-xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: 'Playfair Display, serif' }}>
              Cancel Reservation?
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Are you sure you want to cancel reservation for{' '}
              <span className="font-medium text-gray-700">
                {confirmCancel.date} at {confirmCancel.time}
              </span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmCancel(null)} className="flex-1 btn-outline">
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