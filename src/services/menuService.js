import { ref, get, push, set, update, remove } from 'firebase/database'
import {db} from './firebase'
import { menuData } from '../data/menuData'

// Take all menu items
export async function fetchMenuItems() {
  const snapshot = await get(ref(db, 'menu'))
  if (!snapshot.exists()) return []
  const data = snapshot.val()
  return Object.entries(data).map(([id, item]) => ({ id, ...item }))
}

// Add new menu item
export async function addMenuItem(item) {
  const newRef = push(ref(db, 'menu'))
  await set(newRef, item)
  return newRef.key
}

// Update menu item
export async function updateMenuItem(id, item) {
  await update(ref(db, `menu/${id}`), item)
}

// Menu itemni o'chirish
export async function deleteMenuItem(id) {
  await remove(ref(db, `menu/${id}`))
}

// Upload static data to Firebase once
export async function seedMenuData() {
  const snapshot = await get(ref(db, 'menu'))
  if (snapshot.exists()) return

  const updates = {}
  for (const item of menuData) {
    const { id, ...rest } = item
    const newKey = push(ref(db, 'menu')).key
    updates[`menu/${newKey}`] = rest
  }

  await update(ref(db, '/'), updates)
  console.log('Menu data seeded!')
}