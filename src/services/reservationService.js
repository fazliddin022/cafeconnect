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

// Admin uchun — reservation statusini o'zgartirish
export async function updateReservationStatus(id, status) {
  await update(ref(db, `reservations/${id}`), {
    status,
    updatedAt: new Date().toISOString(),
  })
}

// O'tib ketgan reservationlarni completed ga o'tkazish
export async function autoCompleteReservations() {
  const all = await fetchReservations()
  const now = new Date()

  const promises = all
    .filter((r) => {
      if (r.status === 'cancelled' || r.status === 'completed') return false
      const reservationTime = new Date(`${r.date}T${r.time}`)
      return reservationTime < now
    })
    .map((r) =>
      update(ref(db, `reservations/${r.id}`), {
        status: 'completed',
        updatedAt: new Date().toISOString(),
      })
    )

  await Promise.all(promises)
}