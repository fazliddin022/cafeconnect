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
import { ref, get } from 'firebase/database'
import { db } from '../services/firebase'
import RescheduleModal from '../components/reservation/RescheduleModal'
import { fetchMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } from '../services/menuService'
import { useMenuContext } from '../context/MenuContext'
import { fetchEvents, addEvent, updateEvent, deleteEvent } from '../services/eventService'

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
  const [toast, setToast] = useState(null)
  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }
  const { reloadMenu } = useMenuContext()
  const navigate = useNavigate()
  const [reservations, setReservations] = useState([])
  const [contacts, setContacts] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [events, setEvents] = useState([])
  const [activeTab, setActiveTab] = useState('reservations')
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [rescheduleTarget, setRescheduleTarget] = useState(null)
  const [confirmCancel, setConfirmCancel] = useState(null)

  // Menu modal
  const [showMenuModal, setShowMenuModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [menuForm, setMenuForm] = useState({
    name: '', description: '', price: '', category: 'coffee', isPopular: false, image: '',
  })
  const [menuLoading, setMenuLoading] = useState(false)
  const [confirmDeleteMenu, setConfirmDeleteMenu] = useState(null)

  // Event modal
  const [showEventModal, setShowEventModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [eventForm, setEventForm] = useState({
    title: '', description: '', date: '', time: '', category: 'Music', isFeatured: false, image: '',
  })
  const [eventLoading, setEventLoading] = useState(false)
  const [confirmDeleteEvent, setConfirmDeleteEvent] = useState(null)

  useEffect(() => {
    if (!user) { navigate('/login', { replace: true }); return }
    if (user.email !== 'admin@cafeconnect.com') { navigate('/', { replace: true }); return }
    loadData()
  }, [user])

  const loadData = async () => {
    setLoading(true)
    try {
      await autoCompleteReservations()

      const reservationsData = await fetchReservations()
      setReservations(reservationsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))

      const contactsSnap = await get(ref(db, 'contacts'))
      if (contactsSnap.exists()) {
        const data = contactsSnap.val()
        setContacts(
          Object.entries(data)
            .map(([id, item]) => ({ id, ...item }))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        )
      }

      const items = await fetchMenuItems()
      setMenuItems(items.sort((a, b) => a.category.localeCompare(b.category)))

      const eventsData = await fetchEvents()
      setEvents(eventsData.sort((a, b) => new Date(a.date) - new Date(b.date)))
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

  const handleCancelReservation = (id, date, time) => setConfirmCancel({ id, date, time })

  const confirmCancelAction = async () => {
    const { id } = confirmCancel
    setConfirmCancel(null)
    try {
      await updateReservationStatus(id, 'cancelled')
      setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' } : r)))
    } catch (err) {
      alert('Failed to cancel.')
    }
  }

  // Menu handlers
  const handleOpenMenuModal = (item = null) => {
    setEditingItem(item)
    setMenuForm(item ? {
      name: item.name, description: item.description, price: item.price,
      category: item.category, isPopular: item.isPopular || false, image: item.image || '',
    } : { name: '', description: '', price: '', category: 'coffee', isPopular: false, image: '' })
    setShowMenuModal(true)
  }

  const handleSaveMenuItem = async () => {
    if (!menuForm.name || !menuForm.description || !menuForm.price) return
    setMenuLoading(true)
    try {
      const item = { ...menuForm, price: parseFloat(menuForm.price) }
      if (editingItem) {
        await updateMenuItem(editingItem.id, item)
        setMenuItems((prev) => prev.map((m) => (m.id === editingItem.id ? { ...m, ...item } : m)))
        showToast('Menu item updated successfully!')
      } else {
        const id = await addMenuItem(item)
        setMenuItems((prev) => [...prev, { id, ...item }])
        showToast('Menu item added successfully!')
      }
      setShowMenuModal(false)
      await reloadMenu()
    } catch (err) {
      showToast('Failed to save menu item.', 'error')
    } finally {
      setMenuLoading(false)
    }
  }

  const handleDeleteMenuItem = async () => {
    try {
      await deleteMenuItem(confirmDeleteMenu.id)
      setMenuItems((prev) => prev.filter((m) => m.id !== confirmDeleteMenu.id))
      setConfirmDeleteMenu(null)
      await reloadMenu()
      showToast('Menu item deleted!')
    } catch (err) {
      showToast('Failed to delete menu item.', 'error')
    }
  }

  // Event handlers
  const handleOpenEventModal = (event = null) => {
    setEditingEvent(event)
    setEventForm(event ? {
      title: event.title, description: event.description, date: event.date,
      time: event.time, category: event.category, isFeatured: event.isFeatured || false,
      image: event.image || '',
    } : { title: '', description: '', date: '', time: '', category: 'Music', isFeatured: false, image: '' })
    setShowEventModal(true)
  }

  const handleSaveEvent = async () => {
    if (!eventForm.title || !eventForm.description || !eventForm.date || !eventForm.time) return
    setEventLoading(true)
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, eventForm)
        setEvents((prev) => prev.map((e) => (e.id === editingEvent.id ? { ...e, ...eventForm } : e)))
        showToast('Event updated successfully!')
      } else {
        const id = await addEvent(eventForm)
        setEvents((prev) => [...prev, { id, ...eventForm }])
        showToast('Event added successfully!')
      }
      setShowEventModal(false)
    } catch (err) {
      showToast('Failed to save event.', 'error')
    } finally {
      setEventLoading(false)
    }
  }

  const handleDeleteEvent = async () => {
    try {
      await deleteEvent(confirmDeleteEvent.id)
      setEvents((prev) => prev.filter((e) => e.id !== confirmDeleteEvent.id))
      setConfirmDeleteEvent(null)
      showToast('Event deleted!')
    } catch (err) {
      showToast('Failed to delete event.', 'error')
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
          <button onClick={handleLogout} className="bg-white text-[#c97830] px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100">
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {[
            { key: 'reservations', label: `Reservations (${reservations.length})` },
            { key: 'contacts', label: `Messages (${contacts.length})` },
            { key: 'menu', label: `Menu (${menuItems.length})` },
            { key: 'events', label: `Events (${events.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${activeTab === tab.key ? 'bg-[#c97830] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : activeTab === 'reservations' ? (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['Name', 'Email', 'Date', 'Time', 'Guests', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-sm font-medium text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reservations.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-gray-400">No reservations yet</td></tr>
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
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[r.status]}`}>{r.status}</span>
                        ) : (
                          <select value={r.status} onChange={(e) => handleStatusChange(r.id, e.target.value)}
                            className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#c97830] ${STATUS_STYLES[r.status] || 'bg-gray-100 text-gray-600'}`}>
                            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {r.status !== 'cancelled' && r.status !== 'completed' && (
                          <div className="flex gap-2">
                            <button onClick={() => setRescheduleTarget(r)} className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-[#c97830] hover:text-[#c97830] transition-colors" title="Reschedule">✏️</button>
                            <button onClick={() => handleCancelReservation(r.id, r.date, r.time)} className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-red-400 hover:text-red-400 transition-colors" title="Cancel">🗑️</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'contacts' ? (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['Name', 'Email', 'Subject', 'Message', 'Date'].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-sm font-medium text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {contacts.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-12 text-gray-400">No messages yet</td></tr>
                ) : (
                  contacts.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{c.email}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{c.subject}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm max-w-xs truncate">{c.message}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'menu' ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Menu Items</h2>
              <button onClick={() => handleOpenMenuModal()} className="btn-primary px-4 py-2 text-sm">+ Add Item</button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {['Name', 'Category', 'Price', 'Popular', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-sm font-medium text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {menuItems.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-12 text-gray-400">No menu items yet</td></tr>
                  ) : (
                    menuItems.map((m) => (
                      <tr key={m.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{m.name}</p>
                          <p className="text-gray-400 text-xs mt-0.5 truncate max-w-xs">{m.description}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#fdf0d5] text-[#c97830]">{m.category}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-700 font-medium">${m.price?.toFixed(2)}</td>
                        <td className="px-6 py-4">{m.isPopular ? <span className="text-yellow-500">⭐ Popular</span> : <span className="text-gray-300">—</span>}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => handleOpenMenuModal(m)} className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-[#c97830] hover:text-[#c97830] transition-colors" title="Edit">✏️</button>
                            <button onClick={() => setConfirmDeleteMenu(m)} className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-red-400 hover:text-red-400 transition-colors" title="Delete">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          // Events tab
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Events</h2>
              <button onClick={() => handleOpenEventModal()} className="btn-primary px-4 py-2 text-sm">+ Add Event</button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {['Title', 'Category', 'Date', 'Time', 'Featured', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-sm font-medium text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {events.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-gray-400">No events yet</td></tr>
                  ) : (
                    events.map((e) => (
                      <tr key={e.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{e.title}</p>
                          <p className="text-gray-400 text-xs mt-0.5 truncate max-w-xs">{e.description}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#fdf0d5] text-[#c97830]">{e.category}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm">{e.date}</td>
                        <td className="px-6 py-4 text-gray-500 text-sm">{e.time}</td>
                        <td className="px-6 py-4">{e.isFeatured ? <span className="text-yellow-500">⭐</span> : <span className="text-gray-300">—</span>}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => handleOpenEventModal(e)} className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-[#c97830] hover:text-[#c97830] transition-colors" title="Edit">✏️</button>
                            <button onClick={() => setConfirmDeleteEvent(e)} className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-red-400 hover:text-red-400 transition-colors" title="Delete">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {rescheduleTarget && (
        <RescheduleModal reservation={rescheduleTarget} onConfirm={handleRescheduleConfirm} onClose={() => setRescheduleTarget(null)} />
      )}

      {/* Cancel Reservation Modal */}
      {confirmCancel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center shadow-xl">
            <p className="text-4xl mb-4">🗑️</p>
            <h2 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Cancel Reservation?</h2>
            <p className="text-gray-500 text-sm mb-6">
              Are you sure you want to cancel reservation for{' '}
              <span className="font-medium text-gray-700">{confirmCancel.date} at {confirmCancel.time}</span>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmCancel(null)} className="flex-1 btn-outline">Keep it</button>
              <button onClick={confirmCancelAction} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors">Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Menu Modal */}
      {showMenuModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" value={menuForm.name} onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })} className="input-field" placeholder="Espresso" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={menuForm.description} onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })} className="input-field resize-none" rows={2} placeholder="Rich, concentrated shot..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input type="number" step="0.5" min="0" value={menuForm.price} onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })} className="input-field" placeholder="4.50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={menuForm.category} onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })} className="input-field">
                    <option value="coffee">Coffee</option>
                    <option value="desserts">Desserts</option>
                    <option value="snacks">Snacks</option>
                    <option value="drinks">Drinks</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="url" value={menuForm.image} onChange={(e) => setMenuForm({ ...menuForm, image: e.target.value })} className="input-field" placeholder="https://images.unsplash.com/..." />
                {menuForm.image && <img src={menuForm.image} alt="preview" className="mt-2 h-24 w-full object-cover rounded-lg" onError={(e) => (e.target.style.display = 'none')} />}
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isPopular" checked={menuForm.isPopular} onChange={(e) => setMenuForm({ ...menuForm, isPopular: e.target.checked })} className="w-4 h-4 accent-[#c97830]" />
                <label htmlFor="isPopular" className="text-sm font-medium text-gray-700">Mark as Popular ⭐</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowMenuModal(false)} className="flex-1 btn-outline">Cancel</button>
              <button onClick={handleSaveMenuItem} disabled={menuLoading || !menuForm.name || !menuForm.description || !menuForm.price} className="flex-1 btn-primary disabled:opacity-60">
                {menuLoading ? 'Saving...' : editingItem ? 'Save Changes' : 'Add Item'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Menu Modal */}
      {confirmDeleteMenu && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center shadow-xl">
            <p className="text-4xl mb-4">🗑️</p>
            <h2 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Delete Menu Item?</h2>
            <p className="text-gray-500 text-sm mb-6">Are you sure you want to delete <span className="font-medium text-gray-700">{confirmDeleteMenu.name}</span>?</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDeleteMenu(null)} className="flex-1 btn-outline">Cancel</button>
              <button onClick={handleDeleteMenuItem} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              {editingEvent ? 'Edit Event' : 'Add Event'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} className="input-field" placeholder="Live Jazz Night" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} className="input-field resize-none" rows={2} placeholder="Event description..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input type="time" value={eventForm.time} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })} className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={eventForm.category} onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })} className="input-field">
                  <option value="Music">Music</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Dining">Dining</option>
                  <option value="Art">Art</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="url" value={eventForm.image} onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })} className="input-field" placeholder="https://images.unsplash.com/..." />
                {eventForm.image && <img src={eventForm.image} alt="preview" className="mt-2 h-24 w-full object-cover rounded-lg" onError={(e) => (e.target.style.display = 'none')} />}
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isFeatured" checked={eventForm.isFeatured} onChange={(e) => setEventForm({ ...eventForm, isFeatured: e.target.checked })} className="w-4 h-4 accent-[#c97830]" />
                <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">Mark as Featured ⭐</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowEventModal(false)} className="flex-1 btn-outline">Cancel</button>
              <button onClick={handleSaveEvent} disabled={eventLoading || !eventForm.title || !eventForm.description || !eventForm.date || !eventForm.time} className="flex-1 btn-primary disabled:opacity-60">
                {eventLoading ? 'Saving...' : editingEvent ? 'Save Changes' : 'Add Event'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Event Modal */}
      {confirmDeleteEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center shadow-xl">
            <p className="text-4xl mb-4">🗑️</p>
            <h2 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Delete Event?</h2>
            <p className="text-gray-500 text-sm mb-6">Are you sure you want to delete <span className="font-medium text-gray-700">{confirmDeleteEvent.title}</span>?</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDeleteEvent(null)} className="flex-1 btn-outline">Cancel</button>
              <button onClick={handleDeleteEvent} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === 'error' ? 'bg-red-500' : 'bg-[#c97830]'}`}>
          {toast.type === 'error' ? '❌' : '✅'} {toast.message}
        </div>
      )}
    </div>
  )
}