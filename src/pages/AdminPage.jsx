import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logoutAdmin } from '../services/authService'
import { fetchReservations } from '../services/reservationService'
import { ref, get } from 'firebase/database'
import { db } from '../services/firebase'
import { formatDate } from '../utils/formatters'

export default function AdminPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [reservations, setReservations] = useState([])
  const [contacts, setContacts] = useState([])
  const [activeTab, setActiveTab] = useState('reservations')
  const [loading, setLoading] = useState(true)

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
      const reservationsData = await fetchReservations()
      setReservations(reservationsData)

      const contactsSnap = await get(ref(db, 'contacts'))
      if (contactsSnap.exists()) {
        const data = contactsSnap.val()
        setContacts(Object.entries(data).map(([id, item]) => ({ id, ...item })))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logoutAdmin()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#fffdf7]">
      {/* Header */}
      <div className="bg-[#c97830] text-white px-8 py-4 flex items-center justify-between">
        <h1
          className="text-xl font-bold"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
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
                  {['Name', 'Email', 'Date', 'Time', 'Guests', 'Status'].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reservations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">
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
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {r.status}
                        </span>
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
    </div>
  )
}