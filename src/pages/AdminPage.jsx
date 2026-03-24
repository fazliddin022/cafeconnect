import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logoutAdmin } from '../services/authService'
import { fetchReservations, updateReservationStatus, rescheduleReservation, autoCompleteReservations } from '../services/reservationService'
import { ref, get } from 'firebase/database'
import { db } from '../services/firebase'

const STATUS_STYLES = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-gray-100 text-gray-600',
  rescheduled: 'bg-blue-100 text-blue-800',
}

const STATUS_OPTIONS = ['pending', 'confirmed', 'completed', 'cancelled']

export default function AdminPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [reservations, setReservations] = useState([])
  const [contacts, setContacts] = useState([])
  const [activeTab, setActiveTab] = useState('reservations')
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  // Reschedule modal state
  const [rescheduleId, setRescheduleId] = useState(null)
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')
  const [rescheduling, setRescheduling] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true })
      return
    }
    if (user.email !== 'admin@cafeconnect.com') {
      navigate('/', { replace: true })
      return
    }
    loadData()
  }, [user])

  const loadData = async () => {
  setLoading(true)
  try {
    await autoCompleteReservations()
    const reservationsData = await fetchReservations()
    const sorted = reservationsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    setReservations(sorted)

    const contactsSnap = await get(ref(db, 'contacts'))
    if (contactsSnap.exists()) {
      const data = contactsSnap.val()
      setContacts(
        Object.entries(data)
          .map(([id, item]) => ({ id, ...item }))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      )
    }
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
      setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)))
    } catch (err) {
      alert('Failed to update status.')
    } finally {
      setUpdatingId(null)
    }
  }

const handleReschedule = async () => {
  if (!newDate || !newTime) return

  const selectedDateTime = new Date(`${newDate}T${newTime}`)
  const now = new Date()
  if (selectedDateTime <= now) {
    alert('Please select a future date and time.')
    return
  }

  setRescheduling(true)
  try {
    await rescheduleReservation(rescheduleId, newDate, newTime)
    setReservations((prev) =>
      prev.map((r) =>
        r.id === rescheduleId
          ? { ...r, date: newDate, time: newTime, status: 'rescheduled' }
          : r
      )
    )
    setRescheduleId(null)
    setNewDate('')
    setNewTime('')
  } catch (err) {
    alert('Failed to reschedule.')
  } finally {
    setRescheduling(false)
  }
}

  const handleLogout = async () => {
    await logoutAdmin()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#fffdf7]">
      {/* Header */}
      <div className="bg-[#c97830] text-white px-8 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
          ☕ CaféConnect Admin
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
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
              activeTab === 'reservations'
                ? 'bg-[#c97830] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Reservations ({reservations.length})
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
              activeTab === 'contacts'
                ? 'bg-[#c97830] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Messages ({contacts.length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : activeTab === 'reservations' ? (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['Name', 'Email', 'Date', 'Time', 'Guests', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reservations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">
                      No reservations yet
                    </td>
                  </tr>
                ) : (
                  reservations.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{r.name}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{r.email}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{r.date}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{r.time}</td>
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
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {r.status !== 'cancelled' && r.status !== 'completed' && (
                          <button
                            onClick={() => {
                              setRescheduleId(r.id)
                              setNewDate(r.date)
                              setNewTime(r.time)
                            }}
                            className="px-3 py-1 rounded-lg border border-[#c97830] text-[#c97830] text-xs font-medium hover:bg-[#fdf0d5] transition-colors"
                          >
                            Reschedule
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['Name', 'Email', 'Subject', 'Message', 'Date'].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400">
                      No messages yet
                    </td>
                  </tr>
                ) : (
                  contacts.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{c.email}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{c.subject}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm max-w-xs truncate">{c.message}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {rescheduleId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <h2
              className="text-xl font-bold text-gray-900 mb-6"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Reschedule Reservation
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Time
                </label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setRescheduleId(null)}
                className="flex-1 btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleReschedule}
                disabled={rescheduling || !newDate || !newTime}
                className="flex-1 btn-primary disabled:opacity-60"
              >
                {rescheduling ? 'Saving...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}