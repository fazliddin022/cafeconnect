import { ref, get, push, set, update, remove } from 'firebase/database'
import { db } from './firebase'

export async function fetchEvents() {
  const snapshot = await get(ref(db, 'events'))
  if (!snapshot.exists()) return []
  const data = snapshot.val()
  return Object.entries(data).map(([id, item]) => ({ id, ...item }))
}

export async function addEvent(event) {
  const newRef = push(ref(db, 'events'))
  await set(newRef, event)
  return newRef.key
}

export async function updateEvent(id, event) {
  await update(ref(db, `events/${id}`), event)
}

export async function deleteEvent(id) {
  await remove(ref(db, `events/${id}`))
}