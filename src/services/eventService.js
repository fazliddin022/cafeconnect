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

// Register for the event
export async function registerForEvent(eventId, userId) {
  await set(ref(db, `eventRegistrations/${eventId}/${userId}`), true)
}

// Unregister from Event
export async function unregisterFromEvent(eventId, userId) {
  await remove(ref(db, `eventRegistrations/${eventId}/${userId}`))
}

// Check if the user is registered for this event
export async function isRegistered(eventId, userId) {
  const snapshot = await get(ref(db, `eventRegistrations/${eventId}/${userId}`))
  return snapshot.exists()
}

// Get all registrations in an event
export async function fetchEventRegistrations(eventId) {
  const snapshot = await get(ref(db, `eventRegistrations/${eventId}`))
  if (!snapshot.exists()) return []
  return Object.keys(snapshot.val())
}

// Get registration counts for all events
export async function fetchAllRegistrationCounts() {
  const snapshot = await get(ref(db, 'eventRegistrations'))
  if (!snapshot.exists()) return {}
  const data = snapshot.val()
  const counts = {}
  Object.entries(data).forEach(([eventId, users]) => {
    counts[eventId] = Object.keys(users).length
  })
  return counts
}