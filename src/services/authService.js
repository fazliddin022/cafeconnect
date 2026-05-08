import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { ref, get, set } from 'firebase/database'
import { auth, db } from './firebase'

export async function loginAdmin(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password)
  return result.user
}

export async function logoutAdmin() {
  await signOut(auth)
}

// User rolini Firebase dan olish
export async function getUserRole(uid) {
  try {
    const snapshot = await get(ref(db, `users/${uid}`))
    if (snapshot.exists()) {
      return snapshot.val().role
    }
    return 'customer'
  } catch (err) {
    console.error('Failed to get user role:', err)
    return 'customer'
  }
}

// User phone olish
export async function getUserPhone(uid) {
  try {
    const snapshot = await get(ref(db, `users/${uid}/phone`))
    if (snapshot.exists()) return snapshot.val()
    return ''
  } catch (err) {
    console.error('Failed to get phone:', err)
    return ''
  }
}

// User phone saqlash
export async function saveUserPhone(uid, phone) {
  try {
    await set(ref(db, `users/${uid}/phone`), phone)
  } catch (err) {
    console.error('Failed to save phone:', err)
  }
}