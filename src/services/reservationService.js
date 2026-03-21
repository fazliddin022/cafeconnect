import { ref, push, set, get, update } from 'firebase/database'
import { db } from './firebase'

export async function submitReservation(data) {
  const newRef = push(ref(db, 'reservations'))
  await set(newRef, {
    ...data,
    status: 'pending',
    createdAt: new Date().toISOString(),
  })
  return newRef.key
}

export async function fetchReservations() {
  const snapshot = await get(ref(db, 'reservations'))
  if (!snapshot.exists()) return []
  const data = snapshot.val()
  return Object.entries(data).map(([id, item]) => ({ id, ...item }))
}

// Faqat shu userning reservationlari — email bo'yicha filter
export async function fetchMyReservations(email) {
  const all = await fetchReservations()
  return all.filter((r) => r.email === email)
}

// Reservationni bekor qilish
export async function cancelReservation(id) {
  await update(ref(db, `reservations/${id}`), {
    status: 'cancelled',
    updatedAt: new Date().toISOString(),
  })
}

// Reservationni qayta belgilash
export async function rescheduleReservation(id, newDate, newTime) {
  await update(ref(db, `reservations/${id}`), {
    date: newDate,
    time: newTime,
    status: 'rescheduled',
    updatedAt: new Date().toISOString(),
  })
}