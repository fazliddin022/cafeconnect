import { ref, push, set, get } from 'firebase/database'
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