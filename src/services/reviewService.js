import { ref, push, set, get } from 'firebase/database'
import { db } from './firebase'

// Add a review
export async function submitReview(data) {
  const newRef = push(ref(db, 'reviews'))
  await set(newRef, {
    ...data,
    createdAt: new Date().toISOString(),
  })
  return newRef.key
}

// Get all reviews
export async function fetchReviews() {
  const snapshot = await get(ref(db, 'reviews'))
  if (!snapshot.exists()) return []
  const data = snapshot.val()
  return Object.entries(data).map(([id, item]) => ({ id, ...item }))
}

// Check if a user has left a review for a reservation
export async function hasReviewed(userId, reservationId) {
  const all = await fetchReviews()
  return all.some((r) => r.userId === userId && r.reservationId === reservationId)
}