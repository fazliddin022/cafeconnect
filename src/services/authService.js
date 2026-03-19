import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from './firebase'

export async function loginAdmin(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password)
  return result.user
}

export async function logoutAdmin() {
  await signOut(auth)
}