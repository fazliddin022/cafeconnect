import { ref, push, set } from 'firebase/database'
import { db } from './firebase'

export async function submitContact(data) {
  const newRef = push(ref(db, 'contacts'))
  await set(newRef, {
    ...data,
    createdAt: new Date().toISOString(),
  })
  return newRef.key
}