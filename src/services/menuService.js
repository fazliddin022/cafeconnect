import { ref, get, push, set, update, remove } from 'firebase/database'
import { db } from './firebase'

export async function fetchMenuItems() {
  const snapshot = await get(ref(db, 'menu'))
  if (!snapshot.exists()) return []
  const data = snapshot.val()
  return Object.entries(data).map(([id, item]) => ({ id, ...item }))
}

export async function addMenuItem(item) {
  const newRef = push(ref(db, 'menu'))
  await set(newRef, item)
  return newRef.key
}

export async function updateMenuItem(id, item) {
  await update(ref(db, `menu/${id}`), item)
}

export async function deleteMenuItem(id) {
  await remove(ref(db, `menu/${id}`))
}