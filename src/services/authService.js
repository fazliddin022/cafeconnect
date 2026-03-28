import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { ref, get } from 'firebase/database'
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
    return 'customer' // users/ da yo'q bo'lsa — oddiy customer
  } catch (err) {
    console.error('Failed to get user role:', err)
    return 'customer'
  }
}