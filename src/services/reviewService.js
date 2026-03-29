import { ref, push, set, get } from 'firebase/database'
import { db } from './firebase'

// Review qo'shish
export async function submitReview(data) {
  const newRef = push(ref(db, 'reviews'))
  await set(newRef, {
    ...data,
    createdAt: new Date().toISOString(),
  })
  return newRef.key
}

// Barcha reviewlarni olish
export async function fetchReviews() {
  const snapshot = await get(ref(db, 'reviews'))
  if (!snapshot.exists()) return []
  const data = snapshot.val()
  return Object.entries(data).map(([id, item]) => ({ id, ...item }))
}

// Foydalanuvchining biror reservation uchun review qoldirganini tekshirish
export async function hasReviewed(userId, reservationId) {
  const all = await fetchReviews()
  return all.some((r) => r.userId === userId && r.reservationId === reservationId)
}